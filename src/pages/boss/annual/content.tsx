import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import BossProfileTop from "@/components/boss-profile";
import { UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import debounce from "@/utils/debounce";

import { usePlanYear } from "./queries";
import AnnuolCard from "./ui/card";

export default function HomeContent() {
  const { data } = usePlanYear({});

  const {mutate} = useMutation({
    mutationFn: async ({id, body}:{id:string,body:{yearlyGoal:number}}) => {
      return await UpdateData(apiRoutes.planYear, id || '',body);
    },
    onSuccess: () => {
      toast.success("Аватар успешно изменен");
    },
  });
  
  return (
    <>
      <BossProfileTop />
      <div className="mt-[300px]  max-w-[355px] mx-auto pb-4">
        {data &&
          data?.map((e) => (
            <AnnuolCard
              handleLocalChange={debounce((value) => mutate({id:e?.id, body:{yearlyGoal:parseInt(value)}}),500)}
              key={e?.id}
              year={e?.year}
              yearlyGoal={e?.yearlyGoal}
              collectedAmount={e?.collectedAmount}
              status="Продалжается"
            />
          ))}
      </div>
    </>
  );
}
