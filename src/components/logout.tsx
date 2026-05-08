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
        Akkauntdan chiqish
      </p>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <p>Akkauntdan chiqishni xohlaysizmi?</p>
      <div className="flex justify-end gap-2 mt-2">
        <PopoverClose>
          <Button variant={"outline"}>Bekor qilish</Button>
        </PopoverClose>
        <Button
          onClick={() => {
            removeToken();
            removeUserMe();
          }}
        >
          Chiqish
        </Button>
      </div>
    </PopoverContent>
  </Popover>
  )
}
