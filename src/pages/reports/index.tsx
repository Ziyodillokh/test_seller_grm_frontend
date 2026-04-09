import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

import { SelectDemo } from "@/components/select";
import { useMeStore } from "@/store/me-store";
import formatPrice from "@/utils/formatPrice";

import { useSellerDailyReport } from "./queries";

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

const yearList = Array.from({ length: 5 }, (_, i) => {
  const y = String(new Date().getFullYear() - i);
  return { value: y, label: y };
});

export default function ReportPage() {
  const { meUser } = useMeStore();
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [month, setMonth] = useState<string>(
    String(new Date().getMonth() + 1)
  );
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const { data, isLoading } = useSellerDailyReport(
    meUser?.id,
    Number(year),
    Number(month)
  );

  const totals = data?.totals;
  const plan = data?.plan;
  const days = data?.days || [];

  return (
    <div className="px-4 pb-6">
      {/* Yil va Oy filter */}
      <div className="flex gap-2 my-4">
        <div className="w-1/2">
          <SelectDemo
            value={year}
            options={yearList}
            onChange={(v) => setYear(v)}
            className="w-full h-[42px]"
          />
        </div>
        <div className="w-1/2">
          <SelectDemo
            value={month}
            options={monthList}
            onChange={(v) => setMonth(v)}
            className="w-full h-[42px]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-background border border-border rounded-[12px] p-3">
          <p className="text-[11px] text-muted-foreground">Sotuv</p>
          <p className="text-[16px] font-bold text-[#4DCD20]">
            {formatPrice(totals?.earn || 0)}$
          </p>
        </div>
        <div className="bg-background border border-border rounded-[12px] p-3">
          <p className="text-[11px] text-muted-foreground">Soni</p>
          <p className="text-[16px] font-bold">{totals?.count || 0} sht</p>
        </div>
        <div className="bg-background border border-border rounded-[12px] p-3">
          <p className="text-[11px] text-muted-foreground">Hajm</p>
          <p className="text-[16px] font-bold">{totals?.kv || 0} m²</p>
        </div>
        <div className="bg-background border border-border rounded-[12px] p-3">
          <p className="text-[11px] text-muted-foreground">Skidka</p>
          <p className="text-[16px] font-bold text-[#FF7700]">
            {formatPrice(totals?.discount || 0)}$
          </p>
        </div>
      </div>

      {/* Terminal */}
      <div className="bg-background border border-border rounded-[12px] p-3 mb-3">
        <p className="text-[11px] text-muted-foreground">Terminal</p>
        <p className="text-[16px] font-bold text-[#0075FF]">
          {formatPrice(totals?.plastic || 0)}$
        </p>
      </div>

      {/* Planka progress */}
      {(plan?.planPrice ?? 0) > 0 && (
        <div className="bg-background border border-border rounded-[12px] p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] text-muted-foreground">
              Planka:{" "}
              <span className="font-semibold text-primary">
                {formatPrice(plan?.planPrice || 0)}$
              </span>
            </p>
            <p
              className={`text-[13px] font-bold ${
                (plan?.progress || 0) >= 100
                  ? "text-[#4DCD20]"
                  : "text-[#FF7700]"
              }`}
            >
              {plan?.progress || 0}%
            </p>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (plan?.progress || 0) >= 100 ? "bg-[#4DCD20]" : "bg-[#FF7700]"
              }`}
              style={{ width: `${Math.min(plan?.progress || 0, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-muted-foreground">
              {formatPrice(totals?.earn || 0)}$ /{" "}
              {formatPrice(plan?.planPrice || 0)}$
            </p>
          </div>
        </div>
      )}

      {/* Kunlik jadval */}
      <div className="bg-background border border-border rounded-[12px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-3 py-2.5 border-b border-border bg-muted/50 text-[11px] font-medium text-muted-foreground">
          <span className="w-[60px]">Kun</span>
          <span className="w-[40px] text-center">Soni</span>
          <span className="w-[55px] text-center">Hajm</span>
          <span className="flex-1 text-right">Sotuv</span>
          <span className="w-[70px] text-right">Skidka</span>
          <span className="w-[20px]"></span>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground text-[13px]">
            Yuklanmoqda...
          </div>
        ) : days.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-[13px]">
            Ma'lumot topilmadi
          </div>
        ) : (
          <>
            {days.map((day) => {
              const isExpanded = expandedDate === day.date;
              return (
                <div key={day.date}>
                  {/* Kun qatori */}
                  <div
                    className="flex items-center px-3 py-2.5 border-b border-border text-[13px] cursor-pointer active:bg-muted/30"
                    onClick={() =>
                      setExpandedDate(isExpanded ? null : day.date)
                    }
                  >
                    <span className="w-[60px] text-muted-foreground">
                      {format(new Date(day.date), "dd.MM")}
                    </span>
                    <span className="w-[40px] text-center">{day.count}</span>
                    <span className="w-[55px] text-center">{day.kv}</span>
                    <span className="flex-1 text-right text-[#4DCD20] font-medium">
                      {formatPrice(day.earn)}$
                    </span>
                    <span className="w-[70px] text-right text-[#FF7700]">
                      {formatPrice(day.discount)}$
                    </span>
                    <span className="w-[20px] flex justify-end">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </span>
                  </div>

                  {/* Orderlar (ochilsa) */}
                  {isExpanded && day.orders && day.orders.length > 0 && (
                    <div className="bg-muted/20 border-b border-border">
                      {day.orders.map((order) => (
                        <div
                          key={order.id}
                          className="px-4 py-2.5 border-b border-border/50 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-medium text-[#4DCD20]">
                              {formatPrice(order.price)}$
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {format(new Date(order.date), "HH:mm")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[12px] text-muted-foreground flex-wrap">
                            {order.collection && (
                              <span className="border-r border-border pr-1">
                                {order.collection}
                              </span>
                            )}
                            {order.size && (
                              <span className="border-r border-border pr-1">
                                {order.size}
                              </span>
                            )}
                            <span className="border-r border-border pr-1">
                              x{order.x}
                            </span>
                            {order.color && (
                              <span className="border-r border-border pr-1">
                                {order.color}
                              </span>
                            )}
                            {order.shape && <span>{order.shape}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px]">
                            <span className="text-muted-foreground">
                              {order.kv} m²
                            </span>
                            {order.plasticSum > 0 && (
                              <span className="text-[#0075FF]">
                                Terminal: {formatPrice(order.plasticSum)}$
                              </span>
                            )}
                            {order.discountSum > 0 && (
                              <span className="text-[#FF7700]">
                                Skidka: {formatPrice(order.discountSum)}$
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* JAMI */}
            <div className="flex items-center px-3 py-2.5 bg-muted/50 text-[13px] font-semibold">
              <span className="w-[60px]">JAMI</span>
              <span className="w-[40px] text-center">{totals?.count}</span>
              <span className="w-[55px] text-center">{totals?.kv}</span>
              <span className="flex-1 text-right text-[#4DCD20]">
                {formatPrice(totals?.earn || 0)}$
              </span>
              <span className="w-[70px] text-right text-[#FF7700]">
                {formatPrice(totals?.discount || 0)}$
              </span>
              <span className="w-[20px]"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
