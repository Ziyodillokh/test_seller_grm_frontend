import { format } from "date-fns";
import { Banknote, CreditCard } from "lucide-react";

import { TData } from "../type";

interface IListReports {
    data: TData[],
}


export default function ListReports({ data }: IListReports) {
    return (
        <div className="w-full mt-6">
            <div className="bg-background mt-2 border overflow-hidden border-border rounded-[12px]">
                {
                    data?.map((e) => (
                        <div key={e?.id} className="p-[15px] pt-3 border-b border-border">
                            <div className="flex mb-0.2 gap-1 items-center">
                                <p className="text-[15px] font-medium text-[#4DCD20]">{e.price}</p>
                                <Banknote color="#FF792E" size={"16px"} />
                                <CreditCard color="#0075FF" size={"16px"} />
                                <p className="text-[12px] ml-auto text-primary/60">{format(new Date(e?.date), 'dd MMMM HH:mm')}</p>
                            </div>
                            <div className="flex items-center text-primary text-[13px]">
                                <p className="pr-1  border-r border-border">Название</p>
                                <p className="pr-1 ml-1   border-r border-border">{e?.order?.bar_code?.size?.title}</p>
                                <p className="pr-1 ml-1   border-r border-border">{e?.order?.x}</p>
                                <p className="pr-1 ml-1   border-r border-border">{e?.order?.bar_code?.color?.title}</p>
                                <p className="pr-1 ml-1 border-r border-border">{e?.order?.bar_code?.shape?.title}</p>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}
