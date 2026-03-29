import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import Massage from "./ui/massage";
import TextEditer from "./ui/text-editer";

interface IChatItem {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

interface IChatHistory {
  items: IChatItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

interface IMessage {
  role: "user" | "ai";
  text: string;
  date: string;
  streaming?: boolean;
}

export default function ChatGPT() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const homePath = meUser?.position?.role === 12 ? "/boss/home" : "/home";

  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const baseUrl = (import.meta.env.VITE_BASE_URL as string).replace(/\/$/, "");

  const { data: history, isLoading: historyLoading } = useQuery<IChatHistory>({
    queryKey: [apiRoutes.chatgpt],
    queryFn: () =>
      getAllData<IChatHistory, { page: number; limit: number }>(apiRoutes.chatgpt, {
        page: 1,
        limit: 20,
      }),
  });

  useEffect(() => {
    if (history?.items) {
      const loaded = [...history.items].reverse().flatMap((item) => [
        { role: "user" as const, text: item.prompt, date: item.createdAt },
        { role: "ai" as const, text: item.response, date: item.createdAt },
      ]);
      setLocalMessages(loaded);
    }
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const sendMessage = async (prompt: string) => {
    if (isStreaming) return;

    setLocalMessages((prev: IMessage[]) => [
      ...prev,
      { role: "user", text: prompt, date: new Date().toISOString() },
      { role: "ai", text: "", date: new Date().toISOString(), streaming: true },
    ]);
    setIsStreaming(true);

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
              setLocalMessages((prev: IMessage[]) => {
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
              setLocalMessages((prev: IMessage[]) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "ai",
                  text: aiText,
                  date: new Date().toISOString(),
                  streaming: true,
                };
                return updated;
              });
            }

            if (data.done) {
              setLocalMessages((prev: IMessage[]) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "ai",
                  text: aiText,
                  date: data.createdAt || new Date().toISOString(),
                  streaming: false,
                };
                return updated;
              });
              queryClient.invalidateQueries({ queryKey: [apiRoutes.chatgpt] });
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setLocalMessages((prev: IMessage[]) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          text: "Ulanishda xatolik yuz berdi. Qayta urinib ko'ring.",
          date: new Date().toISOString(),
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const clearHistory = async () => {
    setIsClearing(true);
    try {
      await fetch(`${baseUrl}${apiRoutes.chatgpt}/history`, {
        method: "DELETE",
        credentials: "include",
      });
      setLocalMessages([]);
      queryClient.removeQueries({ queryKey: [apiRoutes.chatgpt] });
    } catch {
      // silent
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="flex flex-col bg-white h-screen relative">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#EBEBEB]">
        <button
          onClick={() => navigate(homePath)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F4F4] transition-colors flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#0D0D0D] leading-tight">AI Yordamchi</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f]" />
            <span className="text-[11px] text-[#10a37f]">Onlayn</span>
          </div>
        </div>
        {localMessages.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={isStreaming}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFF0F0] transition-colors disabled:opacity-30"
          >
            <Trash2 size={16} className="text-[#ef4444]" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 scrollCastom">
        {historyLoading && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 rounded-full border-2 border-[#10a37f] border-t-transparent animate-spin" />
          </div>
        )}

        {!historyLoading && localMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8 py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#10a37f] flex items-center justify-center shadow-lg shadow-green-200">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-[#0D0D0D] mb-1">AI Yordamchi</p>
              <p className="text-[13px] text-[#8E8E8E] leading-relaxed">
                Savdo, ombor yoki moliya bo'yicha savol bering.
                <br />
                Real vaqtda bazadan ma'lumot olaman.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {[
                "Bu oy savdolar qancha?",
                "Omborda qancha gilam bor?",
                "Mijozlar qarzi?",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full border border-[#EBEBEB] text-[12px] text-[#555] hover:border-[#10a37f] hover:text-[#10a37f] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {localMessages.map((msg: IMessage, i: number) => (
          <Massage
            key={i}
            role={msg.role}
            text={msg.text}
            date={msg.date}
            streaming={msg.streaming}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <TextEditer onSend={sendMessage} isPending={isStreaming} />

      {/* Clear history confirmation sheet */}
      {showClearConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 z-40"
            onClick={() => setShowClearConfirm(false)}
          />
          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-5 pt-5 pb-8 shadow-2xl">
            <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-[#ef4444]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#0D0D0D]">Tarixni o'chirish</p>
                <p className="text-[12px] text-[#8E8E8E]">Barcha suhbat tarixi o'chiriladi</p>
              </div>
            </div>
            <p className="text-[13px] text-[#555] leading-relaxed mt-3 mb-5">
              Bu amalni ortga qaytarib bo'lmaydi. Hamma xabarlar butunlay o'chiriladi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#EBEBEB] text-[14px] font-medium text-[#555] hover:bg-[#F4F4F4] transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={clearHistory}
                disabled={isClearing}
                className="flex-1 py-3 rounded-xl bg-[#ef4444] text-[14px] font-medium text-white disabled:opacity-60 transition-colors"
              >
                {isClearing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    O'chirilmoqda...
                  </span>
                ) : (
                  "O'chirish"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
