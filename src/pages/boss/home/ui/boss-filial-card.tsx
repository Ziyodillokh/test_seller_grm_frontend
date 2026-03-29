import { AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";

import { minio_img_url } from "@/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function BossFilialCard({
  year,
  filial,
  name,
  position,
  yearlyGoal,
  collectedAmount,
  handleLocalChange,
  filialLittle,
  avatar,
}: {
  year: number;
  name?: string;
  position?: string;
  filial?: string;
  yearlyGoal: number;
  filialLittle?: string;
  avatar?: string;
  collectedAmount: number;
  handleLocalChange: (item: string) => void;
}) {
  const [value, setValue] = useState(yearlyGoal?.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\$/g, "");
  
    if (/^\d*\.?\d*$/.test(input)) {
      setValue(input);
      handleLocalChange(input);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
       {(name || avatar) ? <Avatar className="w-[48px] border-border flex items-center justify-center border h-[48px] ">
            <AvatarImage
              src={minio_img_url + avatar || undefined}
              alt="@shadcn"
            />
            <AvatarFallback className="w-full text-center bg-transparent">
              {name?.split('')?.[0]}
            </AvatarFallback>
          </Avatar>:""}
        <div>
          {name && (
            <p className="text-[16px] font-bold  text-primary">{name}</p>
          )}
          <div className="flex items-center  w-full gap-3 mb-3">
            {filial && (
              <p className="text-[16px] font-bold  text-primary">{filial}</p>
            )}
            <p className=" text-[12px] font-semibold px-1.5 text-[#E38157] py-[3px] bg-[#E38157]/10 rounded-[4px]">
              {year}
            </p>
            {filialLittle && (
              <p className="text-primary text-[12px] font-semibold px-1.5 py-[3px] bg-[#FFFFFF] rounded-[4px]">
                {filialLittle}
              </p>
            )}
            {position && (
              <p className="text-primary text-[12px] font-semibold px-1.5 py-[3px] bg-[#FFFFFF] rounded-[4px]">
                {position}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full mb-6 border-border border rounded-[7px]">
        <Input
          className="px2.5 h-[48px] border-none py-3 w-full"
          type="text"
          value={value ? `${value}$` : ""}
          onChange={handleChange}
          placeholder="Enter amount"
        />
        <p className="px-2.5 py-3 w-full  text-[#89A143] border-l">
          {collectedAmount}$
        </p>
      </div>
    </>
  );
}
