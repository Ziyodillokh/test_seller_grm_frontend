import { Loader } from "lucide-react";

import FormTextInput from "@/components/forms/FormTextInput";

export default function LoginFormContent({isPending}:{isPending:boolean}) {
 
  return (
    <div className="w-full px-[20px] mt-[46px] m-auto max-w-[500px]">
      <div className="flex  gap-[92px]">
        <div className="w-full  max-w-[360px]">
          <img src={`${import.meta.env.BASE_URL}images/logo.svg`} className="w-[175px] h-[115px]" alt="image" />
          <p className="text-foreground px-[35px] leading-[17px] text-[15px] mb-[35px]">
          Biznesingiz o‘sishi uchun: ishlab chiqarish, ombor, savdo va nazorat jarayonlarini avtomatlashtiring.
          </p>
          <FormTextInput
            name="login"
            placeholder="login"
            label="Tizimga kirish"
            classNameLabel={'ml-[17px] mb-[5px]'}
            className="mb-[42px] px-[30px]  "
            classNameInput="rounded-[12px] h-[48px] bg-card border-none text-[22px] font-medium "
          />
          <button disabled={isPending} className="py-[12px] flex items-center justify-center gap-1 rounded-[12px] px-[25px]  mx-[30px] w-[84%] cursor-pointer bg-primary text-[15px] leading-[18px] text-white">
            {isPending ? <Loader size={12} className="animate-spin " />:""} Kirish
          </button>
        </div>
      </div>
    </div>
  );
}
