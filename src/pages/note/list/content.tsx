import { format } from "date-fns";

import ActionPage from "../form";
import { TData } from "../types";

export default function Content({ data }: { data: TData[] }) {
  return (
    <div>
      <ActionPage />
      {data.length &&
        data?.map((item) => (
          <div
          
            key={item?.id}
            className={`
          ${item?.color == "none" ? "border-border border text-primary" : `text-white bg-[${item?.color}]`} 
          w-full  mb-4 p-5 rounded-[12px]
          ${data.indexOf(item) % 2 === 0 ? "-rotate-1" : "rotate-1"}
          `}
          >
            <p className="font-semibold text-[18px]">{item?.title}</p>
            <p className="mt-2.5 opacity-45 text-[12px]">
              {format(item?.updated_at, "dd.MM.yyyy")}
            </p>
          </div>
        ))}
    </div>
  );
}
