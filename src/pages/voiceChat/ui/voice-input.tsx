import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from "react";
import { Send, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Waveform from "./waveform";

interface VoiceInputProps {
  onSend: (text: string) => void;
  isPending: boolean;
  isAiSpeaking?: boolean;
}

function cleanToUzbekLatin(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9\s.,!?;:'"'\u02BB\u02BC\-()]/g, "");
}

/* ---- Silence detection config ---- */
const SILENCE_THRESHOLD = 0.012; // RMS below this = silence
const SILENCE_DURATION_MS = 2000; // 2s of silence → auto-stop
const SILENCE_CHECK_DELAY_MS = 1500; // wait 1.5s before checking (let user start)
const MAX_RECORDING_MS = 60000; // safety: 60s max

export default function VoiceInput({
  onSend,
  isPending,
  isAiSpeaking = false,
}: VoiceInputProps) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* silence detection refs */
  const silenceAudioCtxRef = useRef<AudioContext | null>(null);
  const silenceAnalyserRef = useRef<AnalyserNode | null>(null);
  const silenceRafRef = useRef<number>(0);
  const silenceStartRef = useRef<number | null>(null);
  const silenceDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStoppingRef = useRef(false);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/$/, "");

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(silenceRafRef.current);
      if (silenceDelayTimerRef.current)
        clearTimeout(silenceDelayTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      silenceAudioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  /* ---- Text send (for keyboard typing fallback) ---- */
  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  }, [value, isPending, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ---- Stop recording ---- */
  const stopRecording = useCallback(() => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    cancelAnimationFrame(silenceRafRef.current);
    if (silenceDelayTimerRef.current)
      clearTimeout(silenceDelayTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    if (silenceAudioCtxRef.current) {
      silenceAudioCtxRef.current.close().catch(() => {});
      silenceAudioCtxRef.current = null;
      silenceAnalyserRef.current = null;
    }

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /* ---- Silence detection loop ---- */
  const checkSilence = useCallback(() => {
    const analyser = silenceAnalyserRef.current;
    if (!analyser || isStoppingRef.current) return;

    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);

    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);

    if (rms < SILENCE_THRESHOLD) {
      if (silenceStartRef.current === null) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current >= SILENCE_DURATION_MS) {
        stopRecording();
        return;
      }
    } else {
      silenceStartRef.current = null;
    }

    silenceRafRef.current = requestAnimationFrame(checkSilence);
  }, [stopRecording]);

  /* ---- Start recording ---- */
  const startRecording = useCallback(async () => {
    try {
      isStoppingRef.current = false;
      silenceStartRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setLiveStream(stream);

      /* silence detection analyser */
      const ctx = new AudioContext();
      silenceAudioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      silenceAnalyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);

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
        stream.getTracks().forEach((t) => t.stop());
        setLiveStream(null);
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 800) {
          isStoppingRef.current = false;
          return;
        }

        setTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", blob, "audio.webm");
          const res = await fetch(`${baseUrl}/chatgpt/transcribe`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          if (!res.ok) throw new Error("Transcribe failed");
          const { text } = await res.json();
          if (text?.trim()) {
            const cleaned = cleanToUzbekLatin(text.trim());
            if (cleaned) {
              /* AUTO-SEND: skip textarea, send directly to AI */
              onSend(cleaned);
            }
          }
        } catch {
          /* silent */
        } finally {
          setTranscribing(false);
          isStoppingRef.current = false;
        }
      };

      recorder.start();
      setIsRecording(true);

      /* start silence detection after delay (let user begin speaking) */
      silenceDelayTimerRef.current = setTimeout(() => {
        if (!isStoppingRef.current) {
          silenceRafRef.current = requestAnimationFrame(checkSilence);
        }
      }, SILENCE_CHECK_DELAY_MS);

      /* safety auto-stop */
      safetyTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording();
        }
      }, MAX_RECORDING_MS);
    } catch {
      setIsRecording(false);
      setLiveStream(null);
      isStoppingRef.current = false;
    }
  }, [baseUrl, onSend, checkSilence, stopRecording]);

  /* ---- Press-and-hold: pointer down starts, pointer up stops ---- */
  const handlePointerDown = useCallback(() => {
    if (isPending || transcribing) return;
    startRecording();
  }, [isPending, transcribing, startRecording]);

  const handlePointerUp = useCallback(() => {
    if (isRecording) stopRecording();
  }, [isRecording, stopRecording]);

  const hasText = value.trim().length > 0;

  return (
    <div className="flex-shrink-0">
      {/* Text input row (typing fallback) */}
      <div className="px-4 pb-2 pt-3 bg-white border-t border-[#EBEBEB]">
        <div className="flex items-end gap-2.5">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-[#F4F4F4] rounded-2xl px-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#ACACAC] outline-none border-none leading-relaxed max-h-32"
            placeholder="Bu yerga savolingizni yozing..."
            value={value}
            rows={1}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 128) + "px";
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={isPending || isRecording || transcribing}
            style={{ height: "44px", minHeight: "44px" }}
          />

          {(hasText || transcribing) && (
            <button
              onClick={handleSend}
              disabled={isPending || !hasText || transcribing}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-30"
            >
              <Send size={20} className="text-[#555]" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Voice recording panel — hidden when keyboard visible */}
      <AnimatePresence>
        {!inputFocused && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-[#F5F5F5] rounded-t-[28px] px-4 pt-6 pb-8 flex flex-col items-center gap-5">
              {/* Status indicator */}
              {transcribing && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#BDBDBD] border-t-[#555] animate-spin" />
                  <span className="text-[13px] text-[#888]">
                    Aniqlayapman...
                  </span>
                </div>
              )}
              {isRecording && !transcribing && (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[13px] text-[#666]">
                    Tinglayapman...
                  </span>
                </div>
              )}

              {/* Waveform pills */}
              <Waveform
                isRecording={isRecording}
                stream={liveStream}
                isAiSpeaking={isAiSpeaking}
              />

              {/* Mic press-and-hold button */}
              <button
                onMouseDown={handlePointerDown}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchEnd={handlePointerUp}
                onTouchCancel={handlePointerUp}
                disabled={isPending || transcribing}
                className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 ${
                  isRecording
                    ? "bg-white shadow-[0_4px_24px_rgba(239,68,68,0.25)]"
                    : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                }`}
              >
                <Mic
                  size={26}
                  className={isRecording ? "text-[#ef4444]" : "text-[#1A1A1A]"}
                  strokeWidth={1.8}
                />
              </button>

              {/* Label */}
              <p className="text-[12px] text-[#BDBDBD]">
                {isRecording
                  ? "Qo'yib yuboring..."
                  : transcribing
                    ? ""
                    : "Bosib turing va gapiring"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
