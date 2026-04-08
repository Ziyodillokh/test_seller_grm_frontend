import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import VoiceMessage from "./ui/voice-message";
import VoiceInput from "./ui/voice-input";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface IChatItem {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

interface IChatHistory {
  items: IChatItem[];
  meta: { totalItems: number; currentPage: number; totalPages: number };
}

interface IMessage {
  role: "user" | "ai";
  text: string;
  date: string;
  streaming?: boolean;
  file?: { name: string; label?: string };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VoiceChat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  /* ---- TTS queue refs ---- */
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const sentenceIdxRef = useRef(0);
  const nextPlayIdxRef = useRef(0);
  const audioQueueRef = useRef<
    Map<number, HTMLAudioElement | null | "error">
  >(new Map());
  const isPlayingRef = useRef(false);
  const pendingTextRef = useRef("");
  const ttsActiveRef = useRef(false);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(
    /\/$/,
    "",
  );

  /* ---- Load history ---- */
  const { data: chatHistory, isLoading: historyLoading } =
    useQuery<IChatHistory>({
      queryKey: [apiRoutes.chatgpt],
      queryFn: () =>
        getAllData<IChatHistory, { page: number; limit: number }>(
          apiRoutes.chatgpt,
          { page: 1, limit: 20 },
        ),
    });

  useEffect(() => {
    if (chatHistory?.items) {
      const loaded = [...chatHistory.items].reverse().flatMap((item) => [
        {
          role: "user" as const,
          text: item.prompt,
          date: item.createdAt,
        },
        {
          role: "ai" as const,
          text: item.response,
          date: item.createdAt,
        },
      ]);
      setLocalMessages(loaded);
    }
  }, [chatHistory]);

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  /* ---- TTS helpers ---- */

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current = null;
    }
  }, []);

  const resetTTSQueue = useCallback(() => {
    stopCurrentAudio();
    sentenceIdxRef.current = 0;
    nextPlayIdxRef.current = 0;
    audioQueueRef.current.clear();
    isPlayingRef.current = false;
    pendingTextRef.current = "";
    ttsActiveRef.current = false;
    setIsAiSpeaking(false);
  }, [stopCurrentAudio]);

  const tryPlayNext = useCallback(() => {
    if (isPlayingRef.current) return;
    const idx = nextPlayIdxRef.current;
    const entry = audioQueueRef.current.get(idx);
    if (entry === undefined || entry === null) return;
    if (entry === "error") {
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      tryPlayNext();
      return;
    }
    isPlayingRef.current = true;
    setIsAiSpeaking(true);
    currentAudioRef.current = entry;
    entry.onended = () => {
      isPlayingRef.current = false;
      URL.revokeObjectURL(entry.src);
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      currentAudioRef.current = null;
      if (!ttsActiveRef.current && audioQueueRef.current.size === 0) {
        setIsAiSpeaking(false);
      } else {
        tryPlayNext();
      }
    };
    entry.onerror = () => {
      isPlayingRef.current = false;
      nextPlayIdxRef.current++;
      audioQueueRef.current.delete(idx);
      currentAudioRef.current = null;
      if (!ttsActiveRef.current && audioQueueRef.current.size === 0) {
        setIsAiSpeaking(false);
      }
      tryPlayNext();
    };
    entry.play().catch(() => {
      isPlayingRef.current = false;
      setIsAiSpeaking(false);
    });
  }, []);

  const fetchTTSSentence = useCallback(
    async (text: string, idx: number) => {
      audioQueueRef.current.set(idx, null);
      try {
        const res = await fetch(`${baseUrl}${apiRoutes.chatgpt}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("TTS error");
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
    [baseUrl, tryPlayNext],
  );

  const flushSentences = useCallback(
    (text: string, isFinal: boolean) => {
      const parts = text.split(/(?<=[.!?,;:])\s+/);
      const toProcess = isFinal ? parts : parts.slice(0, -1);
      const remainder = isFinal ? "" : (parts[parts.length - 1] ?? "");

      for (const sentence of toProcess) {
        const trimmed = sentence.trim();
        if (trimmed.length > 10) {
          const idx = sentenceIdxRef.current++;
          fetchTTSSentence(trimmed, idx);
        }
      }
      return remainder;
    },
    [fetchTTSSentence],
  );

  /* ---- Send message & stream response ---- */

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (isStreaming) return;

      resetTTSQueue();
      ttsActiveRef.current = true;

      setLocalMessages((prev) => [
        ...prev,
        { role: "user", text: prompt, date: new Date().toISOString() },
        {
          role: "ai",
          text: "",
          date: new Date().toISOString(),
          streaming: true,
        },
      ]);
      setIsStreaming(true);

      try {
        const response = await fetch(
          `${baseUrl}${apiRoutes.chatgpt}/stream`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ prompt }),
          },
        );

        if (!response.ok || !response.body) throw new Error("Stream error");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder
            .decode(value, { stream: true })
            .split("\n")
            .filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                setLocalMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "ai",
                    text: data.error,
                    date: new Date().toISOString(),
                    streaming: false,
                  };
                  return updated;
                });
                break;
              }

              if (data.text) {
                aiText += data.text;
                setLocalMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "ai",
                    text: aiText,
                    date: new Date().toISOString(),
                    streaming: true,
                  };
                  return updated;
                });
                pendingTextRef.current += data.text;
                pendingTextRef.current = flushSentences(
                  pendingTextRef.current,
                  false,
                );
              }

              if (data.done) {
                setLocalMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "ai",
                    text: aiText,
                    date: data.createdAt || new Date().toISOString(),
                    streaming: false,
                  };
                  return updated;
                });
                if (pendingTextRef.current.trim().length > 4) {
                  flushSentences(pendingTextRef.current, true);
                  pendingTextRef.current = "";
                }
                ttsActiveRef.current = false;
                queryClient.invalidateQueries({
                  queryKey: [apiRoutes.chatgpt],
                });
              }
            } catch {
              // skip
            }
          }
        }
      } catch {
        setLocalMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "ai",
            text: "Ulanishda xatolik yuz berdi. Qayta urinib ko'ring.",
            date: new Date().toISOString(),
            streaming: false,
          };
          return updated;
        });
        ttsActiveRef.current = false;
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, baseUrl, flushSentences, resetTTSQueue, queryClient],
  );

  /* ---- Cleanup ---- */
  useEffect(() => {
    return () => {
      resetTTSQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-1 px-3 py-3 border-b border-[#EBEBEB] flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F4F4F4] transition-colors flex-shrink-0"
        >
          <ChevronLeft size={22} className="text-[#1A1A1A]" />
        </button>
        <span className="text-[16px] font-semibold text-[#1A1A1A]">Back</span>
      </div>

      {/* ===== Messages ===== */}
      <div className="flex-1 overflow-y-auto py-4 scrollCastom">
        {historyLoading && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 rounded-full border-2 border-[#BDBDBD] border-t-transparent animate-spin" />
          </div>
        )}

        {!historyLoading && localMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-12">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F4F4] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#BDBDBD"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
                Ovozli yordamchi
              </p>
              <p className="text-[13px] text-[#ACACAC] leading-relaxed">
                Mikrofon tugmasini bosing va savolingizni
                <br />
                o'zbek tilida aytib bering.
              </p>
            </div>
          </div>
        )}

        {localMessages.map((msg, i) => (
          <VoiceMessage
            key={i}
            role={msg.role}
            text={msg.text}
            date={msg.date}
            streaming={msg.streaming}
            file={msg.file}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ===== Input + Voice Panel ===== */}
      <VoiceInput onSend={sendMessage} isPending={isStreaming} isAiSpeaking={isAiSpeaking} />
    </div>
  );
}
