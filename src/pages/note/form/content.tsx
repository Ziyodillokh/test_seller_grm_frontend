import { Plus } from 'lucide-react'
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FormTextArea from '@/components/forms/FormTextArea';
import { Button } from "@/components/ui/button";

const colors = ["none","#89A143","#E38157","#509CC2"]
export default function FormContent() {
  const [id,setId] = useQueryState("id");
  const { setValue,watch } = useFormContext();
  const color = watch('color')
  useEffect(()=>{setValue('color','none')},[setValue])
  return (
    <>

    <div className='flex items-center my-4 gap-3'>
            <Button type={id ? "submit" :"button"}  onClick={()=>  setId("new")} className='rounded-full ' variant={"outline"} size={'icon'}><Plus/></Button>
            <div className='w-full flex items-center gap-0.5'>
                {colors?.map(e=>(
                    <div onClick={()=>{
                      setValue('color',e)
                    }}  key={e} className={`${e== color ? "border-black":""} ${e == 'none' ? 'border-broder border': `bg-[${e}] border`} cursor-pointer w-6 h-6 rounded-full`}></div>
                ))}
            </div>
        </div>
      
        {id&& <FormTextArea
            name="title"
            placeholder="title" 
            />}
       
    </>
  );
}
     

