import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { LineBlueIcons, LineRedIcons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { minio_img_url } from "@/constants";
import { useMeStore } from "@/store/me-store";

type TPlanYearMonthly = {
  trend: string;
  percent: string;
  message: string;
};

type TPlanFormance = {
  dailyPlan: 19178.08;
  dailyCollected: 3805.67;
  performancePercent: 19.84;
  gapPercent: 80.16;
  trend: "Tushish";
  message: "Tushish: rejalashtirilganga nisbatan 80.16% tushish";
};
export default function BossHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const { meUser } = useMeStore();
  const [month] = useQueryState("month", parseAsInteger.withDefault(1));
  const [year] = useQueryState("year", parseAsInteger.withDefault(2025));
  const navigateHome = () => {
    if (meUser?.position?.role == 12) {
      navigate("/boss/home");
    } else {
      navigate("/home");
    }
  };
  const handleMenuBack = () => {
    const pathname = location.pathname;
    switch (pathname) {
      case "/boss/profile":
        navigateHome();
        break;

      case "/note":
        navigateHome();
        break;

      case "/bron":
        navigateHome();
        break;

      case "/basket":
        navigateHome();
        break;

      case "/re-report":
        navigate("/profile");
        break;

      case "/re-report/list":
        navigate("/profile");
        break;

      case "/re-register":
        navigate("/profile");
        break;

      case "/re-register/list":
        navigate("/profile");
        break;

      default:
        navigate(-1);
        break;
    }
  };

  const { data } = useQuery({
    queryKey: [apiRoutes.planYearMonthly, month, year],
    queryFn: () =>
      getAllData<TPlanYearMonthly, object>(apiRoutes.planYearMonthly, {
        month: month,
        year: year,
      }),
  });

  const { data: PlanPerformance } = useQuery({
    queryKey: [apiRoutes.planPerformance, month, year],
    queryFn: () =>
      getAllData<TPlanFormance, object>(apiRoutes.planPerformance, {
        month: month,
        year: year,
      }),
  });

  return (
    <>

      <header className="flex items-center bg-[#F5F8FF]  z-100 justify-center pb-[21px] pt-[14px] gap-[25px]">
        {location.pathname === "/boss/home" ? (
          <>
            {Number(data?.percent ) > 0 ? (
              <div className="gap-[7px] z-100  text-[#89A143] flex items-center">
                <LineBlueIcons />
                <p> + {data?.percent} %</p>
              </div>
            ) : (
              <div className="gap-[7px] z-100  text-[#E38157] flex items-center">
              <LineRedIcons />
                <p>  {data?.percent} %</p>
              </div>
            )}

            <Link
              to="/boss/profile"
              className="w-[58px] h-[58px] z-100  border border-border rounded-full flex items-center justify-center"
            >
              <Avatar className="w-full h-full">
                {meUser?.avatar?.path ? (
                  <AvatarImage
                    src={
                      minio_img_url + meUser?.avatar?.path ||
                      undefined
                    }
                    alt="@shadcn"
                  />
                ) : (
                  <AvatarFallback className=" bg-transparent">
                    {meUser?.firstName?.[0]}
                    {meUser?.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
            <div className="gap-[7px] z-100  text-[#E38157] flex items-center">
              <LineRedIcons />
              <p> {PlanPerformance?.gapPercent} %</p>
            </div>
          </>
        ) : (
          <div
            onClick={handleMenuBack}
            className="flex cursor-pointer w-full text-[16px] text-primary border-x border-border gap-1 items-center px-2.5 py-[15px]"
          >
            <ChevronLeft />
            {location?.pathname == "/voiceChat" ? "AI Yordamchi" : "Orqaga"}
          </div>
        )}
      </header>
    </>
  );
}
