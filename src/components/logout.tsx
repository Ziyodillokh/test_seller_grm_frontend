import { PopoverClose } from "@radix-ui/react-popover";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import { Button } from "./ui/button";
export default function LogoutComp() {
    const { removeUserMe } = useMeStore();
    const { removeToken } = useAuthStore();
  return (
    <Popover>
    <PopoverTrigger asChild>
      <p className="text-center cursor-pointer text-primary text-[14px] mt-[50px]">
        Выйти из аккаунта
      </p>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <p>Вы действительно хотите выйти из аккаунта?</p>
      <div className="flex justify-end gap-2 mt-2">
        <PopoverClose>
          <Button variant={"outline"}>Отмена</Button>
        </PopoverClose>
        <Button
          onClick={() => {
            removeToken();
            removeUserMe();
          }}
        >
          Выйти
        </Button>
      </div>
    </PopoverContent>
  </Popover>
  )
}
