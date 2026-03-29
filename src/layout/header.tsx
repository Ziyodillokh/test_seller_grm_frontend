import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Plus,
  RefreshCcw,
  ShoppingBasket,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import Weather from "./weather";



interface iData {
  order: number,
  transfer: number
}
const AvatarPages = ["/home","/home/transfer" ]
const NavigateHomePath = ['/transfer/list','/basket',"/profile"]
export default function Header() {
  const [,setId] = useQueryState("id");
  const location = useLocation();
  const navigate = useNavigate();
  const { meUser } = useMeStore();

  const navigateHome = () => {
    if (meUser?.position?.role == 12) {
      navigate("/boss/home");
    } else  if (  NavigateHomePath.includes(location.pathname)){
      navigate('/home')
    }else{
      navigate(-1);
    }
  };
  

  const {data } =useQuery({
    queryKey: [apiRoutes.orderBasketCounts],
    queryFn: () =>
      getAllData<iData,object>(apiRoutes.orderBasketCounts),
  });

  const Menu  = useMemo(()=>{
    return [
      {
        icons: (isActive: boolean) => {
            return (
              <RefreshCcw
                className={`${isActive ? "bg-[#008CFF] text-background" : "bg-background text-primary"}  w-[24px]`}
              />
            );
        },
        role:[12, 2, 0],
        pathName: "/transfer/list?tab=all",
        count:data?.transfer
      },
      {
        icons: (isActive: boolean) => {
            return (
              <ShoppingBasket
                className={`${isActive ? "bg-[#DC4C2A] text-background" : " bg-background text-primary"}  w-[24px]`}
              />
            );
        },
        role:[2],
        pathName:"/basket",
       count:data?.order
      },
    ];
  },[data])



  return (
    <>
    {/* home/transfer */}
      <header className={`flex  ${location.pathname === "/home"  ? "":"shadow-md"}  top-0 gap-[3px] px-4  w-full pb-2  bg-background  mt-2 z-10   sticky left-0`}>
        {AvatarPages.includes(location.pathname )    ? (
          <div className="flex w-full   gap-[16px] items-center ">
            <Link
              to="/profile"
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
            >
              <Avatar className="w-full h-full">
                {meUser?.avatar?.path ? (
                  <AvatarImage
                    src={
                      "https://s3.gilam-market.uz" + meUser?.avatar?.path ||
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
            <Weather />
          </div>
        ) : (
          <div
            onClick={navigateHome}
            className="flex cursor-pointer w-full text-[16px] text-primary gap-1 items-center px-2.5 py-[15px]"
          >
            <ChevronLeft />
            Назад
          </div>
        )}
           { 
           location.pathname == "/client" ? (
            <div
            onClick={()=>setId("new")}
              className={`cursor-pointer flex  relative  border rounded-[20px] border-border items-center px-[18px] py-[18px]`} 
            >
              <Plus/>
            </div>
          ):
           Menu?.map((e) =>{
              if(e.role.includes(meUser?.position?.role || 0)){
                return  (
                  <Link
                    to={location.pathname.includes(e?.pathName) || e?.pathName?.includes(location.pathname)?'/home': e?.pathName}
                    key={e?.pathName}
                    className={`${location.pathname.includes(e?.pathName) || e?.pathName?.includes(location.pathname)  ?  `bg-[${e?.pathName == "/basket" ? "#DC4C2A" :"#008CFF"}] text-background` : " "} p-[24px] cursor-pointer flex border relative rounded-[20px] border-border items-center `}
                  >
                    {e?.icons(
                      location.pathname.includes(e?.pathName) || e?.pathName?.includes(location.pathname) ? true : false
                    )}
                    {e?.count ? (
                      <p className={`${location.pathname.includes(e?.pathName) || e?.pathName?.includes(location.pathname) ? "bg-background text-primary":`bg-[${e?.pathName == "/basket" ? "#DC4C2A" :"#008CFF"}] text-background` }  rounded-[5px] text-[11px] absolute top-[20px] right-[14px] px-1.5 `}>
                        {e?.count}
                      </p>
                    ) : (
                      ""
                    )}
                  </Link>
                )
              }
            })}
      </header>
    </>
  );
}
