import { format } from "date-fns";

interface ICarpetCard {
  className?: string;
  factoryTitle: string;
  partiyaNoTitle: string;
  countryTitle: string;
  volume: number
  price: number;
  date: Date; //format(row.original.date, "dd.MM.yyyy")
  expense: number;
  status: string;
  onClick:()=>void;
}

export default function PartiyaCard({
  className,
  factoryTitle,
  partiyaNoTitle,
  countryTitle,
  volume,
  price,
  date, //format(row.original.date, "dd.MM.yyyy")
  expense,
  onClick,
  status,
}: ICarpetCard) {



  return (
    // <SwipeableCard onDelete={onDelete}>
      <div
      onClick={onClick}
        className={`w-full relative shadow rounded-[12px] cursor-pointer p-[15px] pr-[50px] bg-background ${className && className}`}
      >
        <p className="text-primary text-[18px] font-bold">
          {factoryTitle} {partiyaNoTitle}
        </p>
        <p className="text-[#008000] my-0.5 text-[13px] font-medium">
          {countryTitle} | {volume} | {price} | <span className="#FF511B">{expense}</span>  
        </p>
        <p className="text-primary/50 text-[12px] font-medium">
          {date? format(date, "dd.MM.yyyy") :""} | {status}
        </p>
      </div>
    // </SwipeableCard>
  );
}
