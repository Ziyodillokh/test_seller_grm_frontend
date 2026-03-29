import { useState, KeyboardEvent, useEffect, useRef, useCallback } from "react";
import { Send, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "@/service/apiRoutes";

function AIWaveIcon({ color }: { color: string }) {
  const bars = [0.5, 0.9, 0.6, 1, 0.7];
  return (
    <div className="flex gap-[2px] items-end" style={{ height: 16, width: 18 }}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="rounded-full flex-1"
          style={{ height: `${h * 100}%`, background: color }}
        />
      ))}
    </div>
  );
}

interface TextEditerProps {
  onSend: (prompt: string) => void;
  isPending: boolean;
}

export default function TextEditer({ onSend, isPending }: TextEditerProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLabel, setRecordingLabel] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/$/, "");

  // Auto-request mic permission on mount (mobile needs early prompt)
  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach((t) => t.stop()))
      .catch(() => {});

    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const trimmed = (text ?? value).trim();
      if (!trimmed || isPending) return;
      onSend(trimmed);
      setValue("");
    },
    [value, isPending, onSend],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    setRecordingLabel("");
  }, []);

  const startRecording = useCallback(async () => {
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

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());

        if (blob.size < 1000) return; // too short, ignore

        setRecordingLabel("Aniqlayapman...");
        try {
          const formData = new FormData();
          formData.append("audio", blob, "audio.webm");
          const res = await fetch(`${baseUrl}${apiRoutes.chatgpt}/transcribe`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          if (!res.ok) throw new Error("Transcribe failed");
          const { text } = await res.json();
          if (text?.trim()) {
            // Insert text and auto-send
            onSend(text.trim());
          }
        } catch {
          // silent fail
        } finally {
          setRecordingLabel("");
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingLabel("Tinglayapman...");

      // Auto-stop after 10s
      timerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 10000);
    } catch {
      alert("Mikrofonga ruxsat bering.");
    }
  }, [baseUrl, onSend]);

  const toggleMic = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="border-t border-[#EBEBEB] bg-white px-3 py-2.5">
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 px-1 pb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] text-red-500 font-medium">{recordingLabel}</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Textarea */}
        <textarea
          className="flex-1 resize-none bg-[#F4F4F4] rounded-2xl px-4 py-2.5 text-[14px] text-[#0D0D0D] placeholder:text-[#ACACAC] outline-none border-none leading-relaxed max-h-32 min-h-[44px]"
          placeholder="Savol yozing..."
          value={value}
          rows={1}
          onChange={(e) => {
            setValue(e.target.value);
            // Auto-resize
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
          }}
          onKeyDown={handleKeyDown}
          disabled={isPending || isRecording}
          style={{ height: "44px" }}
        />

        {/* Right-side action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
          {hasText ? (
            /* Send button */
            <button
              onClick={() => handleSend()}
              disabled={isPending}
              className="w-9 h-9 rounded-full bg-[#10a37f] flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
            >
              {isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send size={15} className="text-white" strokeWidth={2.5} />
              )}
            </button>
          ) : (
            <>
              {/* Mic button — STT */}
              <button
                onClick={toggleMic}
                disabled={isPending}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isRecording
                    ? "bg-red-500 shadow-md shadow-red-200 animate-pulse"
                    : "bg-[#F4F4F4] hover:bg-[#EBEBEB]"
                }`}
              >
                <Mic
                  size={17}
                  className={isRecording ? "text-white" : "text-[#555]"}
                  strokeWidth={2}
                />
              </button>

              {/* Voice chat button */}
              <button
                onClick={() => navigate("/voiceChat")}
                disabled={isPending}
                className="w-9 h-9 rounded-full bg-[#F4F4F4] hover:bg-[#EBEBEB] flex items-center justify-center transition-all active:scale-95"
              >
                <AIWaveIcon color="#10a37f" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
