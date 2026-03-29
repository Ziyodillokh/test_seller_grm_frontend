import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface IThemechecker {
    className?:string;
}

export default function Themechecker({className}:IThemechecker) {
    // const [theme,setThme] = useState("light")
    const {theme, setTheme } = useTheme()
  return (
    <div className={`w-full flex border-border rounded-[12px] border p-1 bg-accent ${className && className}`}>
        <div onClick={()=>setTheme("dark")} className={`${theme==='dark'? "bg-primary p-2.5 rounded-[8px] text-background":"text-primary"} w-full  flex items-center justify-center gap-1 `}>
            <Moon />
            <p className="text-[16px]">Ночной</p>
        </div>
        <div onClick={()=>setTheme("light")} className={`${theme==='light'? "bg-primary p-2.5 rounded-[8px] text-background":"text-primary"} w-full   flex items-center justify-center gap-1 `}>
            <Sun />
            <p className="text-[16px]">Дневной</p>
        </div>
    </div>
  )
}
