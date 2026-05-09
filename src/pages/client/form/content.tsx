import { DialogTitle } from "@radix-ui/react-dialog";
import { useQueryState } from "nuqs";

import FormTextArea from "@/components/forms/FormTextArea";
import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";

export default function FormContent() {
  const [, setId] = useQueryState("id");
  return (
    <>
      <DialogHeader>
        <DialogTitle>Mijoz qo'shish</DialogTitle>
      </DialogHeader>
      <div className="grid px-2 py-1 row-start   mb-2 gap-2 lg:grid-cols-1">
        <FormTextInput
          label="Ism Familiya"
          className="w-full"
          name="fullName"
          placeholder="Ism Familiya"
        />
    
        <FormTextInput
          label="Telefon raqami"
          className="w-full"
          name="phone"
          placeholder="Telefon raqami"
        />

        <FormTextInput
          label="Manzil"
          className="w-full"
          name="address"
          placeholder="Manzil"
        />

        <FormTextArea
          label="Izoh"
          className="w-full"
          name="comment"

          placeholder="Izoh"
        />
      </div>      
      
      <DialogFooter className="!justify-start mt-2 flex">
        <Button type="submit" className="min-w-[220px] h-[44px]">
          Saqlash
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => setId(null)}
          className="bg-white min-w-[220px] h-[44px]"
        >
          Bekor qilish
        </Button>
      </DialogFooter>
    </>
  );
}
