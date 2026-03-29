import { Minus, MoveHorizontal, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import debounce from "@/utils/debounce.ts";

// import SwipeableCard from "./swipeable-card";

interface ICarpetCard {
  className?: string;
  model: string;
  size: string;
  count?: string;
  price: number;
  color: string;
  colaction: string;
  shape: string;
  type: string;
  handleCount: (value: number) => void;
  onDelete: () => void;
  max?: number;
  x: number;
}

function CounBasketInput(props: ICarpetCard) {
  const { handleCount, x } = props;

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={() => {
          if (x > 1) {
            handleCount(x - 1);
          }
        }}
        className="w-11 border-card border bg-sidebar translate-x-2 rounded-full h-11  active:bg-accent  flex items-center justify-center"
      >
        <Minus  size={20}/>
      </div>
      <div className="w-11 active:bg-accent bg-sidebar h-11 rounded-full flex items-center justify-center">
        {x}
      </div>
      <div
        onClick={() => handleCount(x + 1)}
        className="w-11 border-card border  rounded-full -translate-x-2  bg-sidebar active:bg-accent h-11 flex items-center justify-center"
      >
        <Plus size={20}/>
      </div>
    </div>
  );
}

export default function BasketCard({
  className,
  model,
  size,
  x,
  onDelete,
  max,
  handleCount,
  price,
  shape,
  colaction,
  type,
  color,
}: ICarpetCard) {
  // let handleChangeMetric = (value: number) => {
  //   handleCount(Number(value));
  // }
  //
  // handleChangeMetric = debounce(handleChangeMetric, 2000);

  const [value, setValue] = useState<string>("");
  useEffect(() => {
    setValue(String(x ?? ""));
  }, [x]);

  const handleChangeMetric = useRef(
    debounce((val: number) => {
      handleCount(val);
    }, 2000)
  ).current;

  return (
    // <SwipeableCard onDelete={onDelete}>
      <div
        className={`w-full relative flex gap-2 items-center justify-between p-[15px] pr-[50px] rounded-2xl bg-card border-border border ${className && className}`}
      >
        <div className="">
          <p className="text-[13px] font-medium text-primary">{colaction}</p>
          <div className="text-[12px] flex items-center gap-[5px] font-medium my-[1px] text-primary">
            {model}
            <p className="text-[#FF511B]">{price}</p>
          </div>
          <div className="flex items-center text-primary/60 text-[12px]">
            <p className="pr-1 border-r border-border">{color}</p>
            <p className="pr-1 ml-1 border-r border-border">{size}</p>
            {type !== "Штучный" && (
              <p className="pr-1 ml-1 border-r border-border">{max?.toFixed(2)||0}</p>
            )}

            <p className="pr-1 ml-1">{shape}</p>
          </div>
        </div>

        {type == "Штучный" && (
          <CounBasketInput
            handleCount={handleCount}
            x={x}
            price={price}
            shape={shape}
            color={color}
            size={size}
            model={model}
            type={type}
            colaction={colaction}
            onDelete={onDelete}
            className={className}
            max={max}
          />
        )}
        {type == "Метражный" && (
          <div className="px-3 w-full max-w-[110px] py-[10px] flex justify-center items-center gap-1 bg-background rounded-[12px]">
            {/*{max && <p className="text-primary text-[15px] font-medium">{max}</p>}*/}
            <MoveHorizontal
              className="min-w-[16px]"
              size={"16px"}
              // color="#878578"
            />
            <input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                handleChangeMetric(Number(e.target.value));
              }}
              type={"number"}
              placeholder="metr"
              className="outline-none w-full text-[20px] font-semibold no-spinner"
              min={1}
              max={max}
            />
          </div>
        )}
        <button
          onClick={onDelete}
          className="absolute top-0 right-3 cursor-pointer h-full p  px-1  flex items-center"
          aria-label="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    // </SwipeableCard>
  );
}
