import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const Options = [
  { label: "Продукты", value: "Products" },
  { label: "Продажа", value: "Sales" },
  // { label: "Кассы", value: "CashRegisters" },
  { label: "Ежемесячные отчеты", value: "MonthlyReports" },
  { label: "Остатка", value: "StockBalance" },
  { label: "План для флиалов", value: "BranchPlan" },
  { label: "История действий", value: "ActionHistory" }
];

export default function BoossSlidder() {
  const [isSticky, setIsSticky] = useState(false);

  const [select, setSelect] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const [, setReportId] = useQueryState("reportId");
  const [, setReportName] = useQueryState("reportName");
  const [, setKassaId] = useQueryState("kassaId");
  const [, setKassaReportId] = useQueryState("kassaReportId");
  const [, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("search")
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${isSticky ? "bg-[#F6F6F2]" : ""} flex py-2  px-2 sticky top-0 z-10 overflow-scroll gap-0.5 mb-2`}>
      {Options.map((item, index) => {
        return (
          <Button
            onClick={() => {
              setSelect(item?.value)
              setReportId(null)
              setReportName(null)
              setSearch(null)
              setKassaId(null)
              setKassaReportId(null)
            }}
            key={index}
            className={`${select?.includes(item?.value) || item?.value === select ? "bg-primary text-background" : "bg-white text-primary "}  text-nowrap  rounded-2xl p-7`}
          >
            {item?.label}
          </Button>
        );
      })}
    </div>
  );
}
