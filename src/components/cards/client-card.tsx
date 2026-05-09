import { MapPin, MessageSquareText, UserRound } from 'lucide-react'
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AddData } from '@/service/apiHelpers'
import { apiRoutes } from '@/service/apiRoutes'

import TableAction from '../table-action'

interface IClientCard{
    fullName:string
    phone:string
    comment:string
    address?:string
    given:number;
    owed:number;
    id:string;
    seller?: { firstName?: string; lastName?: string; phone?: string } | null;
    onClick?:()=>void
}

export default function ClientCard({fullName,onClick,phone,given,owed,comment,address,seller,id}:IClientCard) {
  const { mutate: createVisit, isPending: visitPending } = useMutation({
    mutationFn: () => AddData("/visit/no-purchase", { clientId: id }),
    onSuccess: () => toast.success("Tashrif qayd etildi"),
  });

  return (
    <div onClick={ onClick ?()=>onClick(): ()=>{}} className={`w-full cursor-pointer bg-background shadow-[0_0_10px_#0000000D] mb-1 rounded-xl pl-[15px] pb-[15px] pt-[12px] pr-[9px]`}>
        <div className='flex items-center justify-between w-full'>
            <p className='text-primary text-[18px] font-medium'>{fullName}</p>
             <TableAction url={apiRoutes.clients} id={id} />
        </div>
        <div  className='flex items-center justify-between w-full'>
           <p className='pt-[3px] pb-[6px] text-[#58A0C6]  text-[14px] font-medium'>{phone}</p>
           <p className='pt-[3px] pb-[6px] text-[#89A143] mr-3  text-[14px] font-medium'>+{given}</p>
        </div>
        <div  className='flex items-center justify-between w-full'>
          <p className=" flex items-start text-[#5D5D53]  text-[14px] gap-1">  {comment && <MessageSquareText width={14} />} { comment}</p>
          <p className='pt-[3px] pb-[6px] text-[#E38157]   mr-3 text-[14px] font-medium'>-{owed}</p>
        </div>
        {address && (
          <p className='flex items-center gap-1 text-[#5D5D53] text-[13px] pt-[3px]'>
            <MapPin width={13} /> {address}
          </p>
        )}
        {seller && (seller.firstName || seller.lastName) && (
          <p className='flex items-center gap-1 text-primary/60 text-[12px] pt-[3px]'>
            <UserRound width={12} /> {seller.firstName} {seller.lastName} {seller.phone ? `(${seller.phone})` : ''}
          </p>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); createVisit(); }}
          disabled={visitPending}
          className='mt-2 w-full h-9 rounded-[10px] border border-dashed border-border text-primary/80 text-[12px] font-medium hover:bg-[#F1F0E9] disabled:opacity-50'
        >
          {visitPending ? "..." : "Tashrif sifatida saqlash"}
        </button>
    </div>
  )
}
