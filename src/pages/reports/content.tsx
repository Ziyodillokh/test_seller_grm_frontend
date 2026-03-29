import { getYear } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { SelectDemo } from "@/components/select";
import { Input } from "@/components/ui/input";
import { useMeStore } from "@/store/me-store";

import { TData, ReportsSummary } from "./type";
import ListReports from "./ui/list-reports";

const monthList = [
  { value: "1", label: "Январь" },
  { value: "2", label: "Февраль" },
  { value: "3", label: "Март" },
  { value: "4", label: "Апрель" },
  { value: "5", label: "Май" },
  { value: "6", label: "Июнь" },
  { value: "7", label: "Июль" },
  { value: "8", label: "Август" },
  { value: "9", label: "Сентябрь" },
  { value: "10", label: "Октябрь" },
  { value: "11", label: "Ноябрь" },
  { value: "12", label: "Декабрь" },
];

export default function Content({
  list,
  month,
  reports,
  setMonth,
}: {
  list: TData[];
  month: string;
  reports?: ReportsSummary["totals"];
  setMonth: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { meUser } = useMeStore();
  const [isSum, setIsSum] = useState<boolean>(false)

  return (
    <div className="px-[22px]">
      {meUser?.position?.role == 2 ? (
        <div className="flex w-full rounded-[12px] overflow-hidden border-border border my-5">
          <p className="p-2.5  w-full text-nowrap flex items-center gap-2  text-center text-[16px] text-primary border-border border-r">
            <RefreshCw onClick={() => setIsSum(state => !state)} color="#FF7700" size={16} />
            {isSum ? reports?.kv?.toFixed(2) + " м²" || 0 : reports?.totalPrice?.toFixed(2) + "$"}
          </p>
          <p className="p-2.5   w-1/2  text-center  text-[16px] text-primary border-border border-r">
            {reports?.count || 0} шт
          </p>
          <Input
            type="number"
            disabled
            className="border-l-0 rounded-[0px] bg-background w-1/2 border-y-0 border-r-1"
            defaultValue={getYear(new Date())}
          />
          <div className="w-1/2  h-[42px] !border-none">

            <SelectDemo
              value={month}
              options={monthList}
              onChange={(value) => {
                setMonth(value || "");
              }}
              className="w-full   h-[48px] !border-none"
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <ListReports data={list} />
    </div>
  );
}
