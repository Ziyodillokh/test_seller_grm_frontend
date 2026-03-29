import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  fromPlaceholder?: string;
  toPlaceholder?: string;
  className?: string;
  btnClassName?: string;
  isonlyDay?: boolean;
  currentMonth?:number;
}

export function DateRangePicker({
  fromPlaceholder,
  toPlaceholder,
  className,
  btnClassName,
  isonlyDay,
  currentMonth,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useQueryState<Date>("startDate", {
    parse: (value) =>
      value
        ? new Date(value)
        : new Date(new Date().getFullYear(), (currentMonth||new Date().getMonth() ), 1),
  });
  const [toDate, setToDate] = useQueryState<Date>("endDate", {
    parse: (value) =>
      value
        ? new Date(value)
        : new Date(new Date().getFullYear(), (currentMonth||new Date().getMonth() ) + 1, 0),
  });
  return (
    <div
      className={`flex  items-center  w-full flex-row gap-3 ${className && className}`}
    >
      <div className="flex-1 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start rounded-sm  text-left border-0 font-normal",
                btnClassName && btnClassName,
                !fromDate && "text-muted-foreground"
              )}
            >
              {<CalendarIcon className=" h-8 w-8 min-w-[24px] mr-1" />}
              {fromDate ? (
                format(fromDate, "dd, LLL, y")
              ) : (
                <span>
                  {fromPlaceholder ? t(fromPlaceholder) : t("From date")}
                </span>
              )}
              {fromDate  ? (
                <div
                  onClick={() => {
                    setFromDate(null);
                  }}
                  className="rounded-full p-1 ml-auto cursor-pointer  border border-primary"
                >
                  <X className="w-[12px]  h-[12px] " />
                </div>
              ) : (
                ""
              )}
            </Button>
            
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate || undefined}
              onSelect={(date) => (date ? setFromDate(date) : "")}
              initialFocus
              disabled={
                isonlyDay
                  ? (date) =>
                      date.getMonth() !== (currentMonth ||new Date().getMonth()) ||
                      date.getFullYear() !== new Date().getFullYear()
                  : (date) => (fromDate ? date < fromDate : false)
              }
            />
          </PopoverContent>
        </Popover>
     
      </div>

      <div className="flex-1  flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start rounded-sm text-left border-0 font-normal",
                btnClassName && btnClassName,
                !toDate && "text-muted-foreground"
              )}
            >
              {<CalendarIcon className="h-8 w-8 min-w-[24px] mr-1" />}
              {toDate ? (
                format(toDate, "dd, LLL, y")
              ) : (
                <span>{toPlaceholder ? t(toPlaceholder) : t("To date")}</span>
              )}

              {toDate ? (
                <div
                  onClick={() => {
                    setToDate(null);
                  }}
                  className="rounded-full p-1 ml-auto cursor-pointer  border border-primary"
                >
                  <X className="w-[12px]  h-[12px] " />
                </div>
              ) : (
                ""
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate || undefined}
              onSelect={(date) => (date ? setToDate(date) : "")}
              initialFocus
              defaultMonth={toDate || undefined}
              disabled={
                isonlyDay
                  ? (date) =>
                      date.getMonth() !== (currentMonth ||new Date().getMonth()) ||
                      date.getFullYear() !== new Date().getFullYear()
                  : (date) => (fromDate ? date < fromDate : false)
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
