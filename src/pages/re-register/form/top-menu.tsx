import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Link, useNavigate } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

interface iData {
  total: number;// qoldiq
inventory: number;//default
surplus:number;// izlishki ortiqcha
deficit:number;// defisit kamomat
}
export default function TopMenu() {

  const {data } =useQuery({
    queryKey: [apiRoutes.reportProductRemaining],
    queryFn: () =>
      getAllData<iData,object>(apiRoutes.reportProductRemaining),
  });

  const navigate = useNavigate()
  const [type, setType] = useQueryState("tab",parseAsString.withDefault("переучет"));
  return (
    <>  
    <header className="flex  new t-10 z-10 mt-[19px]  items-center sticky top-0 left-0 w-full px-4 gap-2 py-[27px] bg-white shadow-md">
      <div onClick={()=>navigate('/profile')} className="flex items-center gap-2 cursor-pointer">
        <ChevronLeft />
        <p className="text-[22px] font-medium">Pereuchot</p>
      </div>
      <p className="ml-auto text-[22px] font-medium">{data?.inventory} m²</p>
    </header>
    <div className="flex mx-2.5 mt-3 gap-2.5">
      <div className="bg-card p-2.5 w-full grid grid-cols-2 gap-2.5  rounded-[18px]">
        <div onClick={()=>type == "остаток" ? setType("переучет"): setType("остаток")} className={`${type == "остаток" ? "bg-[#000000] text-white":"bg-background text-primary"} rounded-[16px] text-center  p-2`}>
          <p className="text-[15px] font-bold mb-1">{data?.total}</p>
          <p className="text-[11px] text-primary bg-background p-1 shadow text-nowrap rounded-[6px]">
            qoldiq-m²
          </p>
        </div>
        <div className=" bg-background rounded-[16px] text-center  p-2">
          <Switch />
          <p className="text-[11px] bg-background text-primary p-1 shadow text-nowrap rounded-[6px]">
            autoScan
          </p>
        </div>
        <div  onClick={()=>type == "излишки" ? setType("переучет"): setType("излишки")} className={`${type == "излишки" ? "bg-[#000000] text-white":"bg-background" }  rounded-[16px] text-center  p-2`}>
          <p className="text-[15px] text-[#FFA916] font-bold mb-1">{data?.surplus}</p>
          <p className="text-[11px] bg-background text-primary p-1 shadow text-nowrap rounded-[6px]">
            ortiqcha
          </p>
        </div>
        <div onClick={()=>type == "дефицит" ? setType("переучет"): setType("дефицит")} className={`${type == "дефицит" ? "bg-[#000000] text-white":"bg-background "} rounded-[16px] text-center  p-2`}>
          <p className="text-[15px] text-[#FF4545] font-bold mb-1">{data?.deficit}</p>
          <p className="text-[11px] bg-background text-primary p-1 shadow text-nowrap rounded-[6px]">
            kamomat
          </p>
        </div>
      </div>
      <Link
        to={`/qr-code-report?type=qrcode&link=re-report`}
        className="w-full flex items-center justify-center relative bg-[#008CFF] rounded-[22px] text-center h-[170px] "
      >
        <div>
          <img
            width={55}
            height={58}
            className="h-[58px]"
            src="/images/scaner1.png"
          />
          <p className="mt-2.5 text-[17px] text-white font-semibold">Skaner</p>
          <img
            width={143}
            height={105}
            className="absolute bottom-0 right-0"
            src="/images/mask.png"
          />
        </div>
      </Link>
    </div>
    </>
  );
}
