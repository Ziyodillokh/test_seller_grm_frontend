import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { getAllData } from "@/service/apiHelpers";
import { TResponse, TSelectOption } from "@/types";
import debounce from "@/utils/debounce";
import { get } from "@/utils/get";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "../ui/form";
import { ComboboxDemo } from "./Combobox";

interface Props<TQuery> {
  name: string;
  label?: string;
  placeholder?: string;
  fetchUrl?: string;
  className?: string;
  disabled?: boolean;
  queries?: TQuery;
  option?: TOption[];
  classNameChild?: string;
  onlocalChange?: (value: TSelectOption) => void;
  fieldNames?: {
    value: string;
    label: string;
  };
}

export type TOption = {
  label: string;
  value: string ;
};

export default function FormComboboxDemoInput<IData, TQuery>({
  name,
  fetchUrl,
  label,
  placeholder,
  className,
  classNameChild,
  disabled,
  queries,
  option,
  onlocalChange,
  fieldNames,
}: Props<TQuery>) {
  const { control, watch } = useFormContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [fetchUrl, search, queries],
      enabled: open && Boolean(fetchUrl),
      queryFn: ({ pageParam = 1 }) =>
        getAllData<TResponse<IData>, TQuery>(fetchUrl || "", {
          search:search,
          limit:6 ,
          page:pageParam,
          ...queries,
        } as TQuery),
      select: (res) => ({
        data: res.pages.flatMap((page) =>
          page.items.map((item) => ({
            value: fieldNames?.value
              ? (item as Record<string, string>)[fieldNames.value]
              : String(item),
            label: fieldNames?.label
              ? get(item as Record<string, string>, fieldNames.label)
              : String(item),
              ...item
          }))
        ),
        meta: res.pages[res.pages.length - 1].meta,
      }),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.currentPage <= lastPage.meta.totalPages) {
          return lastPage?.meta?.currentPage + 1;
        } else {
          return null;
        }
      },
      initialPageParam: 1,
    });


  const memoizedData = useMemo(() => {
    if (option) return option;
    const value = watch(name);

    if (!data?.data) return [value];
    const containsValue = data?.data.some(
      (item) => item?.value === value?.value
    );
    return containsValue ? data?.data : [value, ...data.data];
  }, [data, fieldNames, watch(name), option]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn("flex flex-col items-start w-full", className)}
          >
            {label && (
              <FormLabel className=" font-medium text-[#99998C] dark:text-white">
                {t(label)}
              </FormLabel>
            )}
            <FormControl className="w-full">
              <ComboboxDemo
                className={cn("w-full h-[56px]", classNameChild)}
                onOpenChange={(isopen) => {
                  setOpen(isopen)
                  setSearch(undefined);
                }}
                onFilter={debounce((e) => setSearch(e.target.value), 500)}
                disabled={disabled}
                value={field.value?.value || ""}
                isLoading={isLoading}
                options={memoizedData}
                placeholder={placeholder ? t(placeholder) : ""}
                onChange={(e)=>{
                  field.onChange(e)
                  onlocalChange?.(e)
                }}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
              />
            </FormControl>
            {/* <FormMessage className="text-sm text-red-500" /> */}
          </FormItem>
        );
      }}
    />
  );
}
