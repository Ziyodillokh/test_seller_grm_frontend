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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didStartRef = useRef(false);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/$/, "");

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

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

  // --- Press-and-hold recording ---
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setLiveStream(stream);

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
        if (blob.size < 800) return; // too short

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
              setValue(cleaned);
              setTimeout(() => {
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height =
                    Math.min(textareaRef.current.scrollHeight, 128) + "px";
                }
              }, 0);
            }
          }
        } catch {
          // silent
        } finally {
          setTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      didStartRef.current = true;

      // Auto-stop after 30s safety
      longPressTimer.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 30000);
    } catch {
      setIsRecording(false);
      setLiveStream(null);
    }
  }, [baseUrl]);

  const stopRecording = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    didStartRef.current = false;
  }, []);

  // Touch / mouse handlers for press-and-hold
  const handlePointerDown = useCallback(() => {
    if (isPending || transcribing) return;
    didStartRef.current = false;
    longPressTimer.current = setTimeout(() => {
      // Not a tap — its a long press, but we start right away
    }, 0);
    startRecording();
  }, [isPending, transcribing, startRecording]);

  const handlePointerUp = useCallback(() => {
    if (isRecording) stopRecording();
  }, [isRecording, stopRecording]);

  const hasText = value.trim().length > 0;

  return (
    <div className="flex-shrink-0">
      {/* Text input row */}
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

      {/* Voice recording panel — hidden when input focused (keyboard visible) */}
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
              {/* Transcribing indicator */}
              {transcribing && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#BDBDBD] border-t-[#555] animate-spin" />
                  <span className="text-[13px] text-[#888]">
                    Aniqlayapman...
                  </span>
                </div>
              )}

              {/* Waveform pills */}
              <Waveform
                isRecording={isRecording}
                stream={liveStream}
                isAiSpeaking={isAiSpeaking}
              />

              {/* Mic button */}
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
                  className={
                    isRecording ? "text-[#ef4444]" : "text-[#1A1A1A]"
                  }
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
