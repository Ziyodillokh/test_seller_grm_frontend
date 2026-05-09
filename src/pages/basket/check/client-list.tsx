import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader, Search, X } from "lucide-react";
import { toast } from "sonner";

import { InfiniteLoader } from "@/components/InfiniteLoader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useClientsData from "@/pages/client/list/queries";
import { TData } from "@/pages/client/type";
import { AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

export default function ClientList({
  open,
  setOpen,
  value,
  setValue,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  value: TData | undefined;
  setValue: Dispatch<SetStateAction<TData | undefined>>;
}) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClientsData({
      queries: {
        filial: meUser?.filial?.id || undefined,
        search: debouncedSearch || undefined,
      },
    });
  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page?.items || []) || [],
    [data],
  );

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const resetCreate = () => {
    setShowCreate(false);
    setNewName("");
    setNewPhone("");
    setNewAddress("");
  };

  const { mutate: createClient, isPending: creating } = useMutation({
    mutationFn: (payload: { fullName: string; phone: string; address: string; filialId: string; userId: string }) =>
      AddData(apiRoutes.clients, payload),
    onSuccess: (created: any) => {
      toast.success("Mijoz qo'shildi");
      const newClient = (created?.data ?? created) as TData;
      if (newClient?.id) {
        setValue(newClient);
        setOpen(false);
      }
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clients] });
      resetCreate();
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) { toast.error("Ismni kiriting"); return; }
    if (!newPhone.trim()) { toast.error("Telefon raqamni kiriting"); return; }
    if (!newAddress.trim()) { toast.error("Manzilni kiriting"); return; }
    if (!meUser?.filial?.id || !meUser?.id) { toast.error("Filial yoki user topilmadi"); return; }
    createClient({
      fullName: newName.trim(),
      phone: newPhone.trim(),
      address: newAddress.trim(),
      filialId: meUser.filial.id,
      userId: meUser.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isopen: boolean) => {
        setOpen(isopen);
        if (!isopen) resetCreate();
      }}
    >
      <DialogContent className="max-w-[450px]">
        <p className="text-[18px] text-primary font-medium">Mijozlar</p>

        {!showCreate ? (
          <>
            <div className="flex items-center gap-2 bg-card rounded-[12px] px-3 h-11 mb-2 border border-border">
              <Search className="w-[16px] h-[16px] text-primary/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ism, telefon yoki manzil..."
                className="bg-transparent outline-none w-full text-[14px] text-primary placeholder:text-primary/40"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Tozalash">
                  <X className="w-[14px] h-[14px] text-primary/60" />
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-scroll">
              {flatData.length === 0 && (
                <p className="text-center text-primary/50 text-[13px] py-6">Mijoz topilmadi</p>
              )}
              {flatData?.map((e) => (
                <div
                  key={e?.id}
                  onClick={() => setValue(e)}
                  className={`${value?.id == e?.id ? "bg-card border-border" : "border-border"} rounded-[12px] border w-full mb-1 hover:bg-[#F1F0E9] py-2.5 px-[15px] cursor-pointer`}
                >
                  <p className="text-primary text-[14px] font-medium">{e?.fullName}</p>
                  <p className="pt-[2px] text-[#58A0C6] text-[14px] font-medium">{e?.phone}</p>
                  {e?.address && (
                    <p className="pt-[2px] text-primary/60 text-[12px]">{e.address}</p>
                  )}
                </div>
              ))}

              <InfiniteLoader
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-1 mt-3 h-12 rounded-[12px] border border-dashed border-border text-primary text-[14px] font-medium hover:bg-[#F1F0E9]"
            >
              <Plus className="w-[16px] h-[16px]" /> Yangi Mijoz
            </button>

            <Button
              onClick={() => setOpen(false)}
              disabled={!value}
              className="rounded-[12px] mt-3 h-12 text-center w-full"
            >
              Tanlash
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="To'liq ism"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-12 text-[14px]"
            />
            <Input
              placeholder="+998901234567"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="h-12 text-[14px]"
            />
            <Input
              placeholder="Manzil"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="h-12 text-[14px]"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 h-12 rounded-[12px] bg-[#47B13C] text-white"
              >
                {creating ? <Loader className="w-4 h-4 animate-spin" /> : "Saqlash"}
              </Button>
              <Button
                onClick={resetCreate}
                className="flex-1 h-12 rounded-[12px] bg-white text-primary border border-border"
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
