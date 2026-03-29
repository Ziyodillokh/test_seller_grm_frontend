import { MessageSquareText } from 'lucide-react'

import { apiRoutes } from '@/service/apiRoutes'

import TableAction from '../table-action'

interface IClientCard{
    fullName:string
    phone:string
    comment:string
    given:number;
    owed:number;
    id:string;
    onClick?:()=>void
}
 
export default function ClientCard({fullName,onClick,phone,given,owed,comment,id}:IClientCard) {
  return (
    <div onClick={ onClick ?()=>onClick(): ()=>{}} className={`w-full cursor-pointer bg-background shadow-[0_0_10px_#0000000D] mb-1  rounded-xl  pl-[15px] pb-[19px] pt-[12px] pr-[9px]`}>
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
  
    </div>
  )
}
