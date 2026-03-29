import { useState } from "react"

import { Input } from "@/components/ui/input"

export default function AnnuolCard({
    year,
    status,
    yearlyGoal,
    collectedAmount,
    handleLocalChange
}:{
    year:number,
    status:string,
    yearlyGoal:number,
    collectedAmount:number,
    handleLocalChange:(item:string)=>void
}) {

    const [value, setValue] = useState(yearlyGoal.toString())

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\$/g, "") // $ belgisini olib tashlash
      // faqat raqamlar bo‘lsa update qilamiz
      if (/^\d*$/.test(input)) {
        setValue(input)
      }
      handleLocalChange(input)
    }
  return (
    <>
        <div className="flex items-center w-full gap-1 mb-1.5">
            <p className="text-primary text-[12px] font-semibold px-1.5 py-[3px] bg-[#FFFFFF] rounded-[4px]">{year}</p>
            <p className="text-[#89A143]  text-[12px] font-semibold  px-1.5 py-[3px] bg-[#89A1431A] rounded-[4px]">{status}</p>
        </div>
        <div className="flex w-full border-border border rounded-[7px]">
            <Input
                className="px2.5 h-[48px] border-none py-3 w-full"
                type="text"
                value={value ? `${value}$` : ""}
                onChange={handleChange}
                placeholder="Enter amount"
            />
            <p className="px-2.5 py-3 w-full  text-[#89A143] border-l">{collectedAmount}&$</p>
        </div>
    </>
  )
}
