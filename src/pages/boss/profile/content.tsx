import { CalendarClock, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

import BossProfileTop from "@/components/boss-profile";
import LogoutComp from "@/components/logout";

const ListStatic = [
  {
    id: 1,
    label: "Годовой план",
    icons: () => <Receipt size={24} color="#55554C" />,
    link: "/boss/annual",
  },
  {
    id: 2,
    label: "Инвентаризация",
    icons: () => <CalendarClock   size={24} color="#55554C" />,
    link: "/boss/profile",
  },
];

export default function HomeContent() {
  return (
    <>
     <BossProfileTop/>
    <div className="mt-[300px]  max-w-[305px] mx-auto pb-4">

    {ListStatic?.map((e) => (
        <Link
          to={e.link}
          key={e.id}
          className={`rounded-[12px] bg-white  flex mb-1 items-center gap-[18px] p-3 pl-4`}
        >
          {e?.icons()}
          <p className={`text-[16px] `}>{e?.label}</p>
        </Link>
      ))}
    <LogoutComp/>
    </div>
    </>
  );
}
