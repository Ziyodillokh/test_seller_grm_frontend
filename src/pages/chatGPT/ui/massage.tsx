import { format } from "date-fns";

export interface MassageProps {
  role: "user" | "ai";
  text: string;
  date: string;
  loading?: boolean;
  streaming?: boolean;
}

export default function Massage({ role, text, date, loading, streaming }: MassageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 mb-1">
        <div className="max-w-[78%]">
          <div className="bg-[#F4F4F4] text-[#0D0D0D] rounded-3xl rounded-br-md px-4 py-2.5">
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{text}</p>
          </div>
          {!streaming && date && (
            <p className="text-[11px] text-[#BDBDBD] mt-1 text-right">
              {format(new Date(date), "HH:mm")}
            </p>
          )}
        </div>
      </div>
    );
  }

  // AI message — no bubble, avatar + text (ChatGPT style)
  return (
    <div className="flex gap-2.5 px-4 mb-3">
      <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-full overflow-hidden flex items-center justify-center bg-[#10a37f]">
        <svg width="16" height="16" viewBox="0 0 41 41" fill="none">
          <path
            d="M37.5 16.9a9.96 9.96 0 0 0-.86-8.18 10.08 10.08 0 0 0-10.85-4.84 9.96 9.96 0 0 0-6.72-3 10.08 10.08 0 0 0-9.69 6.99 9.97 9.97 0 0 0-6.56 6.55 10.08 10.08 0 0 0 1.24 11.82 9.96 9.96 0 0 0 .86 8.18 10.08 10.08 0 0 0 10.85 4.84 9.96 9.96 0 0 0 6.72 3 10.08 10.08 0 0 0 9.69-6.99 9.97 9.97 0 0 0 6.56-6.55A10.08 10.08 0 0 0 37.5 16.9z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {loading || (streaming && !text) ? (
          <div className="flex items-center gap-1 py-2">
            <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-bounce [animation-delay:300ms]" />
          </div>
        ) : (
          <>
            <p className="text-[14px] leading-relaxed text-[#0D0D0D] whitespace-pre-wrap">
              {text}
              {streaming && (
                <span className="inline-block w-[2px] h-[1.1em] bg-[#10a37f] ml-0.5 animate-pulse align-text-bottom rounded-sm" />
              )}
            </p>
            {!streaming && date && (
              <p className="text-[11px] text-[#BDBDBD] mt-1">
                {format(new Date(date), "HH:mm")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
