import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import BossHeader from "@/layout/boss-header";

import BranchPlan from "./sections/branch-plan";
import InComePage from "./sections/in-come";
import BossKassa from "./sections/kassa";
import BossModel from "./sections/model";
import BossProducts from "./sections/product";
import BossKassaReport from "./sections/report";
import BossSales from "./sections/sales";
import BossTotalSales from "./sections/sales-all";
import BossSize from "./sections/size";
import BossStock from "./sections/stock";
import PriceSlider from "./ui/price-slider";
import BoossSlidder from "./ui/slidder";


export default function HomeContent() {
  const [select] = useQueryState(
    "select",
    parseAsString.withDefault("Products")
  );
  const [, setSearch] = useQueryState("search");
  const [, setFilial] = useQueryState("filial");
  const [, setUser] = useQueryState("user");
  const selectObj = {
    Products: () => <BossProducts />,
    Sales: () => <BossSales />,
    CashRegisters: () => <BossKassa />,
    MonthlyReports: () => <BossKassaReport />,
    MonthlyReportsKassa: () => <BossKassa />,
    MonthlyReportsKassaSingle: () => <BossSales />,
    StockBalance: () => <BossStock />,
    BranchPlan: () => <BranchPlan />,
    ActionHistory: () => "",
    inCome: () => <InComePage />,
    outCome: () => <InComePage />,
    BossTotalsales: () => <BossTotalSales />,
    BossModel: () => <BossModel />,
    BossSize: () => <BossSize />,
  }

  useEffect(() => {
    setSearch(null)
    if (!["BossModel", "StockBalance", "BossSize"].includes(select))
      setFilial(null)
    setUser(null)
  }, [select])

  return (
    <>
      <div
        className="absolute h-[360px] bg-custom-gradient  z-1 w-full overflow-hidden"
        style={{
          background:
            " linear-gradient(194deg, #F4F8FF 2.41%, #F6F9FF 45.54%, #FFF3E5 67.14%, #F5DED6 95.7%)",
        }}
      />
      <BossHeader />
      <PriceSlider />
      <BoossSlidder />
      {/* eslint-disable @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      {selectObj[select]()}

    </>
  );
}
