import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calculator,
  ChevronRight,
  ClipboardList,
  IdCard,
  QrCode,
  ScanLine,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import LogoutComp from "@/components/logout";
import { SelectDemo } from "@/components/select";
import Themechecker from "@/components/theme-checker";
import { UploadFile } from "@/components/UploadFile";
import { getAllData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import Valuta from "./valuta";

export default function Content() {
  const { meUser } = useMeStore();
  const [month, setMonth] = useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [years] = useState<string>(new Date().getFullYear().toString());

  // Seller app'da "Переучёт" menu faqat filial_report.status === 'open' bo'lganda ko'rinadi
  const { data: filialReportsResp } = useQuery({
    queryKey: [apiRoutes.filialReport, meUser?.filial?.id],
    queryFn: () => getAllData<{ items: any[] }, any>(apiRoutes.filialReport, { filialId: meUser?.filial?.id, limit: 1 }),
    enabled: !!meUser?.filial?.id,
  });
  const latestReport = filialReportsResp?.items?.[0];
  const hasOpenPereuchot = (latestReport?.status || "").toLowerCase() === "open";

  const filialReport = hasOpenPereuchot
    ? [
        {
          id: 4,
          label: "Переучёт",
          icons: () => <Calculator color="#55554C" />,
          link: "/re-report",
        },
      ]
    : [];

  const ListStaticSeller = [
    {
      id: 1,
      label: "Отчеты",
      icons: () => <ClipboardList color="#55554C" />,
      link: "/reports",
    },
    {
      id: 2,
      label: "Проверка продукта",
      icons: () => <ScanLine color="#55554C" />,
      link: "/product-check",
    },
    // {
    //   id: 4,
    //   label: "Трансфер",
    //   icons: () => <RefreshCcw color="#55554C" />,
    //   link: "/transfer",
    // },
    {
      id: 5,
      label: "Клиенты",
      icons: () => <IdCard color="#55554C" />,
      link: "/client",
    },
    {
      id: 5,
      label: "QR-код данные",
      icons: () => <QrCode color="#55554C" />,
      link: "/new-qr-code",
    },

    ...filialReport,
  ];
  const ListStaticOther = [
    // {
    //   id: 1,
    //   label: "Партии",
    //   icons: () => <FolderInput color="#55554C" />,
    //   link: "/partiya",
    // },
    {
      id: 2,
      label: "Проверка продукта",
      icons: () => <ScanLine color="#55554C" />,
      link: "/product-check",
    },
    {
      id: 5,
      label: "QR-код данные",
      icons: () => <QrCode color="#55554C" />,
      link: "/new-qr-code",
    },


    ...filialReport,
  ];

  const ListStatic =
    meUser?.position?.role == 2 ? ListStaticSeller : ListStaticOther;

  const monthList = [
    { value: "1", label: "Январь" },
    { value: "2", label: "Февраль" },
    { value: "3", label: "Март" },
    { value: "4", label: "Апрель" },
    { value: "5", label: "Май" },
    { value: "6", label: "Июнь" },
    { value: "7", label: "Июль" },
    { value: "8", label: "Август" },
    { value: "9", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" },
  ];

  const { data } = useQuery({
    queryKey: ["seller-reports/total", month, years],
    queryFn: async () =>
      getAllData("/seller-reports/total", {
        month: Number(month),
        userId: meUser?.id,
        year: Number(years),
      }),
  });
  const { mutate } = useMutation({
    mutationFn: async (uuid: string) => {
      return await UpdatePatchData(apiRoutes.user, meUser?.id || "", {
        avatar: uuid,
      });
    },
    onSuccess: () => {
      toast.success("Аватар успешно изменен");
    },
  });

  return (
    <div className="text-center min-h-screen px-[35px] my-8">
  
        <UploadFile type="avatar" getUploadValue={(uuid) => mutate(uuid)} />
        <p className="my-2.5 text-[19px] font-semibold text-primary">
          {meUser?.firstName + " " + meUser?.lastName}{" "}
        </p>
        <p className="text-[14px] mb-10 text-primary">{meUser?.filial?.title}</p>


      {meUser?.position?.role == 2 ? (
        <div className="flex w-full overflow-hidden rounded-[12px] border-border border mb-5">
          <p className="p-4  w-full  text-center text-[16px] text-primary border-border border-r">
            {(data as unknown as { totalSellKv: number })?.totalSellKv || 0} м²
          </p>
          <p className="p-4  w-full  text-center  text-[16px] text-primary border-border border-r">
            {(data as unknown as { totalSellPrice: number })?.totalSellPrice?.toFixed(2) } $
          </p>
          {/* <Input type="number" className="border-l-0 border-y-0 border-r-1" defaultValue={years} onChange={debounce((e) =>  setYears(e.target.value), 500)}/> */}
          <SelectDemo
            value={month}
            options={monthList}
            onChange={(value) => {
              setMonth(value || "");
            }}
            className="w-full h-[55px] !border-none"
          />
        </div>
      ) : (
        ""
      )}
      {ListStatic?.map((e) => (
        <Link
          to={e.link}
          key={e.id}
          className={` flex mb-2 items-center gap-[18px] rounded-[12px] py-3 px-4 bg-card`}
        >
          {e?.icons()}
          <p className={`text-[16px] `}>{e?.label}</p>
          <ChevronRight className="opacity-45 ml-auto" />
        </Link>
      ))}
      <Valuta />
      <Themechecker className="mt-11.5" />
      <LogoutComp />
    </div>
  );
}
