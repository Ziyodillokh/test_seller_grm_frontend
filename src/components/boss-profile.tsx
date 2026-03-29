import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { UploadFile } from "@/components/UploadFile";
import { UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

export default function BossProfileTop() {
    const { meUser } = useMeStore();
    const {mutate} = useMutation({
      mutationFn: async (uuid: string) => {
        return await UpdatePatchData(apiRoutes.user, meUser?.id || '',{avatar:uuid});
      },
      onSuccess: () => {
        toast.success("Аватар успешно изменен");
      },
    });
  return (
    <div
    className="absolute max-h-[390px]  py-[40px] bg-custom-gradient  z-1 w-full overflow-hidden"
    style={{
      background:
        " linear-gradient(194deg, #F4F8FF 2.41%, #F6F9FF 45.54%, #FFF3E5 67.14%, #F5DED6 95.7%)",
    }}
  >
     <div className="text-center">
     <UploadFile type="avatar" getUploadValue={(uuid)=>mutate(uuid)}/>
      <p className="my-2.5 text-[19px] font-semibold text-primary">
        {meUser?.firstName + " " + meUser?.lastName}{" "}
      </p>
      <p className="text-[14px] text-primary">Владелец бизнеса</p>
     </div>
    </div>
  )
}
