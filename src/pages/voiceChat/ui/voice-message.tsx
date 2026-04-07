import { format } from "date-fns";
import { FileSpreadsheet, Download } from "lucide-react";

export interface VoiceMessageProps {
  role: "user" | "ai";
  text: string;
  date: string;
  streaming?: boolean;
  file?: { name: string; label?: string };
}

export default function VoiceMessage({
  role,
  text,
  date,
  streaming,
  file,
}: VoiceMessageProps) {
  const isUser = role === "user";
  const formattedTime =
    !streaming && date ? format(new Date(date), "HH:mm") : null;

  // --- User bubble (right-aligned) ---
  if (isUser) {
    return (
      <div className="flex justify-end px-4 mb-2">
        <div className="max-w-[80%]">
          <div className="bg-[#F0F0F0] text-[#1A1A1A] rounded-[20px] rounded-br-md px-4 py-3">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>
          {formattedTime && (
            <p className="text-[11px] text-[#BDBDBD] mt-1 text-right pr-1">
              {formattedTime}
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- AI bubble (left-aligned) ---
  return (
    <div className="px-4 mb-2">
      <div className="max-w-[85%]">
        {/* Text message */}
        {text && (
          <div className="bg-[#F6F6F6] text-[#1A1A1A] rounded-[20px] rounded-bl-md px-4 py-3">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {text}
              {streaming && (
                <span className="inline-block w-[2px] h-[1.1em] bg-[#1A1A1A] ml-0.5 animate-pulse align-text-bottom rounded-sm" />
              )}
            </p>
          </div>
        )}

        {/* Loading dots */}
        {streaming && !text && (
          <div className="bg-[#F6F6F6] rounded-[20px] rounded-bl-md px-5 py-4 inline-flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#BDBDBD] animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-[#BDBDBD] animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-[#BDBDBD] animate-bounce [animation-delay:300ms]" />
          </div>
        )}

        {/* File download card */}
        {file && (
          <div className="mt-2 inline-flex items-center gap-3 bg-white border border-[#EBEBEB] rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet size={22} className="text-[#2E7D32]" />
            </div>
            <div className="flex items-center gap-2">
              <Download size={16} className="text-[#555]" />
              <span className="text-[14px] font-medium text-[#1A1A1A]">
                Download
              </span>
            </div>
          </div>
        )}

        {/* File label */}
        {file?.label && (
          <p className="text-[11px] text-[#BDBDBD] mt-1 pl-1">
            {file.label}
          </p>
        )}

        {/* Timestamp */}
        {formattedTime && !streaming && (
          <p className="text-[11px] text-[#BDBDBD] mt-1 pl-1">
            {formattedTime}
          </p>
        )}
      </div>
    </div>
  );
}
