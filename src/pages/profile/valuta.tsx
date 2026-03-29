import { useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import { CurrencyData } from "./types";

export default function Valuta() {
  const token = useAuthStore((state) => state.token);
  const { meUser } = useMeStore();
  const { data } = useQuery({
    queryKey: ["currency", token, meUser],
    queryFn: () => getAllData<CurrencyData, unknown>("currency"),
  });

  return (
    <div className="flex w-full rounded-[12px] overflow-hidden mt-[45px]">
      <div className="w-1/2 flex p-3 items-center justify-between text-white bg-[#89A143]">
        <p className="text-[18px] font-bold">
          {data?.items?.[0]?.usd.toLocaleString("uz-UZ")} $
        </p>
        <p className="text-[13px] font-bold"></p>
      </div>
      <div className="w-1/2 flex p-3 items-center justify-between text-white bg-[#E38157]">
        <p className="text-[18px] font-bold">
          {data?.items?.[0]?.uzs.toLocaleString("uz-UZ")} сум
        </p>
        <p className="text-[13px] font-bold"></p>
      </div>
    </div>
  );
}
