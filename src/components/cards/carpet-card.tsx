import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Circle, ImageOff, Loader, RefreshCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useOrderBasket from "@/pages/hame/action";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import { BeigeIcons, BusketIcons } from "../icons";

interface ICarpetCard {
  id: string;
  type?: string;
  className?: string;
  model: string;
  shape: string;
  size: string;
  count: number;
  img?: string;
  price?: number;
  color: string;
  colaction: string;
  discount?: string;
  carpetType: string;
  isBron?: boolean;
  isBacket?: boolean;
  isTransfer?: boolean;
  book_count?: number;
  isPartiya?: boolean;
}

const CarpetCard: React.FC<ICarpetCard> = ({
  className,
  id,
  discount,
  isPartiya,
  model,
  type,
  shape,
  carpetType,
  size,
  book_count,
  price,
  isTransfer,
  count,
  img,
  colaction,
  color,
  isBacket = false,
}) => {
  const [, setOpenBronId] = useQueryState("openBronId");
  const navigate = useNavigate();
  const QueryClient = useQueryClient();

  const { meUser } = useMeStore();

  const { mutate, isPending } = useOrderBasket({
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasket] });
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.product] });
      QueryClient.invalidateQueries({ queryKey: [apiRoutes.orderBasketCounts] });

      toast.success("Продукт добавлено успешно!");
    },
  });

  return (
    <div
      className={`w-full relative rounded-[12px]  border-border border ${className && className}`}
    >
      <div className={`flex border-b border-border/40`}>
        <p
          className={`p-2 text-nowrap overflow-clip w-1/3 text-[12px] text-primary  text-center border-border/40 border-r`}
        >
          {model}
        </p>
        <p
          className={`p-2 text-nowrap  overflow-clip   w-1/3 text-[12px] text-primary text-center  border-border/40 border-r`}
        >
          {size}
        </p>
        <p className="p-2 text-nowrap   overflow-clip  w-1/3 text-[12px] text-primary text-center">
          {count}
        </p>
      </div>
      <div
        onClick={() => navigate(`/carpet/${id}${type ? `?tab=${type}&isPartiya=${isPartiya}` : "/"}`)}
        className="w-full relative cursor-pointer "
      >
        <p
          className={`bg-white rounded-[5px]  text-primary font-bold absolute left-0.5 top-0.5 p-1`}
        >
          {colaction}
        </p>
        {img ? (
          <img
            className="w-full"
            style={{ aspectRatio: "0.67/1" }}
            src={"https://s3.gilam-market.uz" + img}
          />
        ) : (
          <div
            style={{ aspectRatio: "0.67/1" }}
            className="flex items-center justify-center flex-col"
          >
            <ImageOff className="text-primary text-[20px] w-[60px] h-[60px]" />
            <p className="text-[18px] font-semibold text-primary mt-2">
              Нет фото
            </p>
          </div>
        )}
        <p
          className={`bg-white rounded-[5px]  text-primary  absolute left-1 bottom-1 px-1`}
        >
          {color}
        </p>
      </div>

      <p className="flex gap-2 items-center px-1.5">
        {shape === "Rectangle" ? (
          <BeigeIcons />
        ) : shape === "Rulo" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M9.33343 8.03778C9.24183 8.23533 9.10085 8.40593 8.9241 8.53311C8.21743 9.00844 7.2761 8.60777 6.89543 7.92044C6.3361 6.91178 6.9101 5.67511 7.9121 5.20044C9.24743 4.56711 10.8261 5.30311 11.4054 6.59111C12.1354 8.21244 11.2121 10.0898 9.59876 10.7551C7.64476 11.5604 5.41009 10.4764 4.64009 8.58511C3.73343 6.35644 5.01143 3.82911 7.23743 2.97844C9.80743 1.99578 12.7041 3.43178 13.6614 5.92644C14.7481 8.76178 13.1128 11.9424 10.2734 12.9771C7.0881 14.1371 3.52809 12.3498 2.38476 9.25044C2.16078 8.64886 2.03103 8.01629 2.0001 7.37511"
              stroke="#45453C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : shape === "Circle" ? (
          <Circle width={16} height={16} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 14C5.79086 14 4 11.3137 4 8C4 4.68629 5.79086 2 8 2C10.2091 2 12 4.68629 12 8C12 11.3137 10.2091 14 8 14Z"
              stroke="#45453C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {price ? `${price}$` : shape}
      </p>
      {!isBacket && (
        <>
          {discount ? (
            <div>
              <div className="w-[46px] cursor-pointer absolute right-0 bottom-[46px]  bg-[#FF5E45] text-background h-[46px] flex items-center justify-center">
                -{discount}%
              </div>
            </div>
          ) : (
            ""
          )}

          {book_count ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpenBronId(id);
              }}
              className={`w-[56px] cursor-pointer absolute ${(book_count || 0) < count ? "bottom-[70px]" : "bottom-[7px]"} rounded-2xl right-[8px] bg-[#FF7700] text-background h-[56px] flex items-center justify-center`}
            >
              <Bookmark className="text-white w-[24px]" />
              <p className="absolute top-1  text-white font-bold text-[12px] right-2">
                {book_count}
              </p>
            </div>
          ) : (
            ""
          )}

          {(book_count || 0) < count ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isPending) {
                  mutate({
                    product: id,
                    x: carpetType == "Метражный" ? count : 1,
                    isMetric: carpetType == "Метражный" ? true : false,
                    is_transfer: isTransfer || false,
                  });
                }
              }}
              className="w-[56px] cursor-pointer shadow absolute right-[8px] bottom-[7px] bg-background rounded-2xl text-primary h-[56px] flex items-center justify-center"
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : meUser?.position.role == 2 && !isTransfer ? (
                <BusketIcons />
              ) : (
                <RefreshCcw />
              )}
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default CarpetCard;
