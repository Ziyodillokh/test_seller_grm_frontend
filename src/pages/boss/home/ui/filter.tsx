import { ListFilter } from "lucide-react";

import SearchInput from "@/components/search-input";

export default function Filter() {
  return (
    <div className="flex gap-0.5 mx-2.5  mt-[11px] mb-[22px] w-clac(100% - 20px)">
         <SearchInput className="p-2 py-1 w-full rounded-[6px] bg-white border-border/40 border" />
        <div className="p-2.5 cursor-pointer bg-[#509CC4]   rounded-[6px] inline-flex items-center gap-0.5 text-white">
            <ListFilter/>
        Фильтр
        </div>
    </div>  
  )
}
