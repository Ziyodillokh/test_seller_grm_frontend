import { ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
// import { ProductsData } from "@/pages/basket/type.ts";
// interface ICheckList {
//   data: ProductsData[]
// }
export default function CheckView() {
  // const {data} = props;
  // console.log(data, 'data ==>>>');
    const navigate = useNavigate()
  return (
    <div className="w-full text-center max-w-[316px] mx-auto my-[57px]">
        <p className="text-primary text-[18px] font-medium">Сдайте выручку кассиру для подтверждения продажи</p>
        <p className="text-primary/50 text-[14px] mt-2.5 mb-5">Продавец должен передать сумму продажи кассиру. Только после этого товар считается проданным.</p>
        <div className="flex mb-[50px] items-center justify-center gap-0.2">
            <ReceiptText size={16} color="#55554C"/>
        <p className="underline text-[15px] text-primary">скачать чек</p>
        </div>

        <Button onClick={()=>navigate('/home')} className="rounded-[2px] mt-10 h-12 text-center w-full">Вернуться на главную</Button>

    </div>
  )
}
