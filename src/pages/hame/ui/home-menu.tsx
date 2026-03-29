import { useLocation, useNavigate } from "react-router-dom";

import QrTabs from "./qr-tabs";

const Menu = [
    {
      id:1,
      image:'/images/1.png',
      text:"Hisobot",
      link:'/reports',
    },
    {
      id:2,
      image:'/images/2.png',
      text:"Mijozlar",
      link:'/client',
    },
    {
      id:3,
      image:'/images/3.png',
      text:"Transfer",
      link:'/home/transfer',
    },
    {
      id:4,
      image:'/images/4.png',
      text:"Sotish",
      link:'/home',
    },
  
  ] 
export default function HomeMenu() {
  const navigate = useNavigate();
  const location = useLocation()
  return (
    <div className={`flex  gap-2.5 mx-4 mt-[17px]`}>
        <div className="p-2.5 bg-card grid  cursor-pointer row-start grid-cols-2  gap-2.5 rounded-[18px] w-full">
            {
              Menu.map((e)=>(
                <div 
                onClick={()=>{
                    navigate(e?.link)
                }}
                key={e?.id} className={`${(e?.link == location?.pathname) ?  `bg-[${e?.link == "/home" ? "#DC4C2A" :"#008CFF"}]`:"bg-white"}  relative text-center rounded-[14px] p-2.5`}>
                    <img src={e?.image} alt="image" width={47} height={47} className="w-20 "/>
                    <div className="left-0 absolute bottom-0 p-2.5 w-full">
                        <p className="text-[11px] bg-white rounded-[6px]  w-full p-1 shadow">{e?.text}</p>
                    </div>
                </div>
              ))
            }
        </div>
        <QrTabs link={location?.pathname == '/home' ? "home":'home/transfer'}  />
    </div>
  )
}
