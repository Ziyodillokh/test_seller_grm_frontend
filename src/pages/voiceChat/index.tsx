import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Volume2 } from "lucide-react";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

type Status = "idle" | "listening" | "thinking" | "speaking";

const STATUS_TEXT: Record<Status, string> = {
  idle: "Bosing va gapiring...",
  listening: "Tinglayapman...",
  thinking: "Fikrlayapman...",
  speaking: "Javob bermoqda...",
};

const STATUS_COLOR: Record<Status, string> = {
  idle: "#10a37f",
  listening: "#ef4444",
  thinking: "#f59e0b",
  speaking: "#3b82f6",
};

// AI waveform icon (animated bars)
function AIWaveIcon({ color, animate }: { color: string; animate: boolean }) {
  const bars = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8];
  return (
    <div className="flex gap-[3px] items-end" style={{ height: 36, width: 44 }}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="rounded-full flex-1"
          style={{
            height: `${h * 100}%`,
            background: color,
            animation: animate ? `bounce 0.9s ease-in-out infinite` : "none",
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function VoiceChat() {
  const navigate = useNavigate();
  const { meUser } = useMeStore();
  const homePath = meUser?.position?.role === 12 ? "/boss/home" : "/home";
  const [status, setStatus] = useState<Status>("idle");
  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  // Request mic permission immediately on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        setMicPermission("granted");
      })
      .catch(() => setMicPermission("denied"));
  }, []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Streaming TTS queue
  const sentenceIdxRef = useRef(0);
  const nextPlayIdxRef = useRef(0);
  const audioQueueRef = useRef<Map<number, HTMLAudioElement | null | "error">>(new Map());
  const isPlayingRef = useRef(false);
  const pendingTextRef = useRef("");
  const ttsActiveRef = useRef(false);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/$/, "");

  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current = null;
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const resetTTSQueue = () => {
    stopCurrentAudio();
    sentenceIdxRef.current = 0;
    nextPlayIdxRef.current = 0;
    audioQueueRef.current.clear();
    isPlayingRef.current = false;
    pendingTextRef.current = "";
    ttsActiveRef.current = false;
  };

  const tryPlayNext = useCallback(() => {
    if (isPlayingRef.current) return;
    const idx = nextPlayIdxRef.current;
    const entry = audioQueueRef.current.get(idx);
    if (entry === undefined) return; // not yet in queue
    if (entry === null) return; // still fetching
    if (entry === "error") {
      // skip failed, try next
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      tryPlayNext();
      return;
    }
    isPlayingRef.current = true;
    setStatus("speaking");
    currentAudioRef.current = entry;
    entry.onended = () => {
      isPlayingRef.current = false;
      URL.revokeObjectURL(entry.src);
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      currentAudioRef.current = null;
      // If no more sentences pending and queue empty → idle
      if (!ttsActiveRef.current && audioQueueRef.current.size === 0) {
        setStatus("idle");
      } else {
        tryPlayNext();
      }
    };
    entry.onerror = () => {
      isPlayingRef.current = false;
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      currentAudioRef.current = null;
      tryPlayNext();
    };
    entry.play().catch(() => {
      isPlayingRef.current = false;
    });
  }, []);

  const fetchTTSSentence = useCallback(
    async (text: string, idx: number) => {
      audioQueueRef.current.set(idx, null); // mark as fetching
      try {
        const res = await fetch(`${baseUrl}${apiRoutes.chatgpt}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("TTS xatosi");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioQueueRef.current.set(idx, audio);
        tryPlayNext();
      } catch {
        audioQueueRef.current.set(idx, "error");
        tryPlayNext();
      }
    },
    [baseUrl, tryPlayNext]
  );

  const flushSentences = useCallback(
    (text: string, isFinal: boolean) => {
      // Split on sentence ends OR commas (for faster first audio start)
      const parts = text.split(/(?<=[.!?,;:])\s+/);
      const toProcess = isFinal ? parts : parts.slice(0, -1);
      const remainder = isFinal ? "" : parts[parts.length - 1] ?? "";

      for (const sentence of toProcess) {
        const trimmed = sentence.trim();
        // Minimum 10 chars to avoid fetching single words
        if (trimmed.length > 10) {
          const idx = sentenceIdxRef.current++;
          fetchTTSSentence(trimmed, idx);
        }
      }
      return remainder;
    },
    [fetchTTSSentence]
  );

  const sendToGPT = useCallback(
    async (prompt: string) => {
      setStatus("thinking");
      setAiText("");
      resetTTSQueue();
      ttsActiveRef.current = true;

      try {
        const response = await fetch(`${baseUrl}${apiRoutes.chatgpt}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ prompt }),
        });
        if (!response.ok || !response.body) throw new Error("Stream xatosi");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setAiText(fullText);
                pendingTextRef.current += data.text;
                pendingTextRef.current = flushSentences(pendingTextRef.current, false);
              }
              if (data.done || data.error) {
                const finalText = data.error ? "Xatolik yuz berdi." : fullText;
                setHistory((prev) => [
                  ...prev,
                  { role: "user", text: prompt },
                  { role: "ai", text: finalText },
                ]);
                setAiText("");
                // Flush remaining text
                if (pendingTextRef.current.trim().length > 4) {
                  flushSentences(pendingTextRef.current, true);
                  pendingTextRef.current = "";
                }
                ttsActiveRef.current = false;
                // If nothing queued, go idle
                if (audioQueueRef.current.size === 0 && !isPlayingRef.current) {
                  setStatus("idle");
                }
              }
            } catch {
              // skip
            }
          }
        }
      } catch {
        setStatus("idle");
        setAiText("");
        ttsActiveRef.current = false;
      }
    },
    [baseUrl, flushSentences]
  );

  const transcribeAndSend = useCallback(
    async (blob: Blob) => {
      setStatus("thinking");
      try {
        const formData = new FormData();
        formData.append("audio", blob, "audio.webm");
        const res = await fetch(`${baseUrl}${apiRoutes.chatgpt}/transcribe`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!res.ok) throw new Error("Transcribe xatosi");
        const { text } = await res.json();
        if (!text?.trim()) {
          setStatus("idle");
          return;
        }
        setUserText(text);
        await sendToGPT(text);
      } catch {
        setStatus("idle");
      }
    },
    [baseUrl, sendToGPT]
  );

  const startListening = async () => {
    if (status !== "idle") {
      stopCurrentAudio();
      stopRecording();
      resetTTSQueue();
      setStatus("idle");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        transcribeAndSend(blob);
      };

      recorder.start();
      setStatus("listening");
      setUserText("");
      setAiText("");

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
    } catch {
      setStatus("idle");
      alert("Mikrofonga ruxsat bering.");
    }
  };

  const color = STATUS_COLOR[status];
  const isActive = status !== "idle";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0d0d0d] overflow-hidden">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: `${color}22` }}
          >
            <Volume2 size={16} style={{ color }} />
          </div>
          <span className="text-white/70 text-[14px] font-medium">AI Ovozli Yordamchi</span>
        </div>
        <button
          onClick={() => {
            stopCurrentAudio();
            stopRecording();
            resetTTSQueue();
            navigate(homePath);
          }}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X size={18} className="text-white/70" />
        </button>
      </div>

      {/* Center - Orb */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="relative flex items-center justify-center">
          {/* Speaking rings */}
          {status === "speaking" && (
            <>
              <div
                className="absolute rounded-full opacity-20 animate-ping"
                style={{ width: 200, height: 200, background: color, animationDuration: "1.5s" }}
              />
              <div
                className="absolute rounded-full opacity-10 animate-ping"
                style={{ width: 240, height: 240, background: color, animationDuration: "2s", animationDelay: "0.3s" }}
              />
            </>
          )}

          {/* Listening ring */}
          {status === "listening" && (
            <div
              className="absolute rounded-full opacity-30 animate-ping"
              style={{ width: 180, height: 180, background: color, animationDuration: "1s" }}
            />
          )}

          {/* Main orb */}
          <div
            className="relative rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              width: 140,
              height: 140,
              background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}66)`,
              boxShadow: `0 0 60px ${color}44, 0 0 120px ${color}22`,
              transform: isActive ? "scale(1.08)" : "scale(1)",
            }}
          >
            {status === "listening" ? (
              <AIWaveIcon color="white" animate={true} />
            ) : status === "thinking" ? (
              <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            ) : status === "speaking" ? (
              <AIWaveIcon color="white" animate={true} />
            ) : (
              <AIWaveIcon color="white" animate={false} />
            )}
          </div>
        </div>

        {/* Status text */}
        <p className="text-[15px] font-medium transition-all duration-300" style={{ color: `${color}cc` }}>
          {STATUS_TEXT[status]}
        </p>

        {/* User text */}
        {userText && (
          <div className="w-full max-w-[320px] text-center">
            <p className="text-white/40 text-[11px] mb-1">Siz:</p>
            <p className="text-white/80 text-[14px] leading-relaxed">{userText}</p>
          </div>
        )}

        {/* AI response */}
        {(aiText || status === "speaking") && (
          <div className="w-full max-w-[320px] text-center">
            <p className="text-white/40 text-[11px] mb-1">AI:</p>
            <p className="text-white/90 text-[14px] leading-relaxed line-clamp-4">
              {aiText}
              {status === "thinking" && (
                <span className="inline-block w-1 h-4 bg-white/60 ml-0.5 animate-pulse" />
              )}
            </p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="w-full flex flex-col items-center gap-4 pb-12">
        {/* History */}
        {history.length > 0 && (
          <div className="w-full max-w-[360px] max-h-[100px] overflow-y-auto px-4 space-y-1">
            {history.slice(-4).map((h, i) => (
              <div
                key={i}
                className={`text-[12px] truncate ${h.role === "user" ? "text-white/40" : "text-white/60"}`}
              >
                {h.role === "user" ? "Siz: " : "AI: "}
                {h.text}
              </div>
            ))}
          </div>
        )}

        {micPermission === "denied" ? (
          /* Permission denied state */
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.4)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <p className="text-[#ef4444] text-[13px] text-center px-6">
              Mikrofonga ruxsat berilmagan. Telefon sozlamalaridan ruxsat bering.
            </p>
          </div>
        ) : (
          /* Mic button */
          <button
            onClick={startListening}
            disabled={micPermission === "unknown"}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-50"
            style={{
              background: isActive ? `${color}22` : "rgba(255,255,255,0.08)",
              border: `2px solid ${isActive ? color : "rgba(255,255,255,0.15)"}`,
              boxShadow: isActive ? `0 0 30px ${color}44` : "none",
            }}
          >
            <AIWaveIcon color={isActive ? color : "rgba(255,255,255,0.6)"} animate={status === "listening" || status === "speaking"} />
          </button>
        )}

        <p className="text-white/30 text-[12px]">
          {micPermission === "denied"
            ? "Ruxsat talab qilinadi"
            : status === "idle"
            ? "Bosing va gapiring"
            : "To'xtatish uchun bosing"}
        </p>
      </div>
    </div>
  );
}
