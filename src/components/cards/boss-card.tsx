import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";

import TebleAvatar from "../teble-avatar";
import { Skeleton } from "../ui/skeleton";

interface IColums {
  label: string;
  values: string[] | number[];
  onClick?:()=> void;
}
interface IBossCardProps {
  price?: string;
  priceSecond?: string | undefined;
  month?: string;
  status?: string;
  filial?: string;
  person?: string;
  personSecond?: string;
  date?: string;
  iconBgColor?: string;
  volume?: number;
  title?: string;
  colums: IColums[];
  personName?: string;
  personSecondName?: string;
  plaasticSum?: string;
  iconComponent?: () => JSX.Element;
  onClick?:()=> void;
  rowOne?: boolean;
  isLoading?: boolean;
  topWidth?: number;
  personStatus?:string;
  personSecondStatus?:string;
  statusColor?: string;
  pricelast?:string
}
export default function BossCard({
  personName,
  price,
  priceSecond,
  volume,
  rowOne,
  plaasticSum,
  isLoading,
  pricelast,
  month,
  statusColor,
  status,
  filial,
  person,
  personSecond,
  personSecondName,
  personStatus,
  personSecondStatus,
  date,
  title,
  colums,
  topWidth = 200,
  iconComponent,
  onClick,
  //   iconBgColor,
}: IBossCardProps) {
  return (
    <div onClick={onClick} className={`${onClick ? "cursor-pointer":""} px-2.5 mb-[10px] pb-6`}>
      <div className="flex items-center mb-2.5 gap-2">
        {iconComponent ? (
          iconComponent()
        ) : (
          <CalendarCheck
            className={`p-3 w-12 h-12 $ text-white bg-[#89A143] rounded-[12px]`}
          />
        )}

        <div className={`flex items-center gap-2 flex-wrap max-w-[${topWidth}px]  mr-auto gap-.5`}>
          {price && (
            <p className="text-[#89A143] mr-2 font-semibold text-[16px]">{price}</p>
          )}
          {plaasticSum && (
            <p className="text-[#509CC4] font-semibold text-[16px]">
              {plaasticSum}
            </p>
          )}
          {priceSecond && (
            <p className="text-[#E38157] font-semibold text-[16px]">
              {priceSecond}
            </p>
          )}
          {volume && (
            <p className="text-[#509CC4] font-semibold text-[16px]">
              {volume.toFixed(2)} м²
            </p>
          )}
           {pricelast && (
            <p className="text-[#89A143] mr-2 font-semibold text-[16px]">{pricelast}</p>
          )}
          {month && (
            <p className="text-[#89A143] py-[3px] text-[12px] px-[6px] rounded-[4px] bg-[#89A143]/10">
              {month}
            </p>
          )}
          {status && (
            <p className={`text-white py-[3px] text-[12px]  px-[6px] rounded-[4px] ${statusColor? statusColor:"bg-[#E2C658]"}`}>
              {status}
            </p>
          )}
          {title && (
            <p className=" font-semibold text-[16px] w-full ">{title}</p>
          )}
          {filial && (
            <p className="bg-white py-[3px]  text-[12px] px-[6px] rounded-[4px] ">
              {filial}
            </p>
          )}
        </div>

        {personName || person ? (
          <TebleAvatar url={person}  status={personStatus} name={personName ||""}/>
        ) : (
          ""
        )}
        {personSecond || personSecondName ? (
          <TebleAvatar url={personSecond} status={personSecondStatus} name={personSecondName ||""}/>
        ) : (
          ""
        )}
      </div>

      {isLoading ? (
        <div className="w-full  p-2 border-border border border-b-0 overflow-hidden rounded-[7px]">
          {[1,2,3,4]?.map((index) => (
            <Skeleton key={index} className="h-8 mb-1 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex w-full gap-[5.5px]">
          {colums && (
            <div className="w-full  border-border border border-b-0 overflow-hidden rounded-[7px]">
              {colums
                ?.slice(
                  0,
                  colums?.length >= 4 && !rowOne
                    ? colums?.length / 2
                    : colums?.length + 1
                )
                ?.map((item) => (
                  <div onClick={()=>{
                    if(item?.onClick) item?.onClick()
                  }} className={`${item?.onClick? "cursor-pointer":""} flex w-full border-border border-b`}>
                    {item?.label?.length ? (
                      <p className="w-full text-[#62625F] text-[12px] border-border border-r font-normal p-2.5">
                        {item?.label}
                      </p>
                    ) : (
                      ""
                    )}
                    {item?.values?.map((value, index) => (
                      <p
                        className="w-full text-[12px]  font-semibold text-[#4B4B48] p-2.5"
                        key={index}
                      >
                        {value}
                      </p>
                    ))}
                  </div>
                ))}
            </div>
          )}
          {colums && colums?.length >= 4 && !rowOne && (
            <div  className="w-full  border-border border border-b-0 overflow-hidden rounded-[7px]">
              {colums?.slice(colums?.length / 2)?.map((item) => {
             
                if (item?.label) {
                  return (
                    <div onClick={item?.onClick} className={`${item?.onClick? "cursor-pointer":""} flex w-full border-border border-b`}>
                      <p className="w-full text-[#62625F] text-[12px] border-border border-r font-normal p-2.5">
                        {item?.label}
                      </p>
                      {item?.values?.map((value, index) => (
                        <p
                          className="w-full text-[12px]  font-semibold text-[#4B4B48] p-2.5"
                          key={index}
                        >
                          {value}
                        </p>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-[#62625F] text-[10px] font-normal px-[6px] py-[3px] rounded-[4px] inline-block bg-white">
        {date && format(date, "dd, LLL, y")}
      </p>
    </div>
  );
}
