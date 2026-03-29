import { Minus, Plus } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface iCounInput {
    count :number,
    setCount:Dispatch<SetStateAction<number | undefined>>
}

export default function CounInput({count,setCount}:iCounInput) {
  return (
     <div className='flex justify-center gap-0.5'>
        <div onClick={()=>setCount(state => state ? state >1 ? state-1 :state : 0)} className='w-[68px] bg-card rounded-lg active:bg-accent h-[62px] flex items-center justify-center'>
          <Minus/>
        </div>
        <div className='w-[88px] bg-card rounded-lg active:bg-accent h-[62px] flex items-center justify-center'>
          {count}
        </div>
        <div
         onClick={()=>setCount(count+1)} 
          className='w-[68px] bg-card rounded-lg active:bg-accent h-[62px] flex items-center justify-center'>
          <Plus/>
        </div>
      </div>
  )
}
