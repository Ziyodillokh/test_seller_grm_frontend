import { parseAsString, useQueryState } from "nuqs";

import { useMeStore } from "@/store/me-store";


interface  IOptions {
    label: string;
    value: string
}
interface IFilterTabs {
    className?:string;
    handleTabFile:(item:{value: string, label: string})=>void
    data?: IOptions[]
}

export default function FilterTabs({className, handleTabFile, data}:IFilterTabs) {
    const { meUser } = useMeStore();
    const [tab] = useQueryState("tab",parseAsString.withDefault(meUser?.filial?.id || ""))
    const myId = meUser?.filial?.id;

    // Move the tab with value === myId to the first position
    const sortedData = data
      ? [
          ...data.filter((item) => item.value === myId),
          ...data.filter((item) => item.value !== myId),
        ]
      : [];
      
  return (
    <div className={`border-border flex overflow-x-scroll border border-r-0 ${className && className}`}>
        {
            sortedData?.map((item: { label: string, value: string }, index:number) => (
                <p onClick={() => {
                    handleTabFile!(item)
                }} key={item.label} className={`${item.value === tab ? "text-background bg-primary": (index=== 0 && !tab) ? 'text-background bg-primary' : ""} p-3 inline-block text-nowrap`}> {item.label}</p>
            ))
        }
    </div>
  )
}
