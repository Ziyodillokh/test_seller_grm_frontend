import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllData } from "@/service/apiHelpers";
import { TResponse, TSelectOption } from "@/types";
import debounce from "@/utils/debounce";
import { get } from "@/utils/get";

import { ComboboxDemo } from "../forms/Combobox";

interface Props<TQuery> {
  label?: string;
  name: string;
  placeholder?: string;
  fetchUrl?: string;
  className?: string;
  disabled?: boolean;
  queries?: TQuery;
  option?: TOption[];
  icons?: React.ReactNode;
  defaultValue?: string;
  value?: TSelectOption | null;
  setValue?: (value: TSelectOption) => void;
  onLocalChange?: (value: TSelectOption) => void;
  isFilter?:boolean;
  isAll?:boolean
  fieldNames?: {
    value: string;
    label: string;
  };
}

export type TOption = {
  label: string;
  value: string;
};

export default function FilterComboboxDemoInput<IData, TQuery>({
  value,
  name,
  setValue,
  fetchUrl,
  icons,
  placeholder,
  disabled,
  queries,
  className,
  option,
  defaultValue,
  fieldNames,
  isAll=true,
  isFilter=true,
}: Props<TQuery>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const [QValue, setQValue] = useQueryState(
    name,
    parseAsString.withDefault(defaultValue || "")
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [fetchUrl, search, queries],
      enabled: open && Boolean(fetchUrl),
      queryFn: ({ pageParam = 1 }) =>
        getAllData<TResponse<IData>, TQuery>(fetchUrl || "", {
          search:search,
          limit:10,
          page:pageParam,
          ...queries,
        } as TQuery),
      select: (res) => ({
        data: res.pages.flatMap((page) =>
          page?.items?.map((item) => ({
            value: fieldNames?.value
              ? (item as Record<string, string>)[fieldNames.value]
              : String(item),
            label: fieldNames?.label
              ? get(item as Record<string, string>, fieldNames.label)
              : String(item),
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
    })

  const memoizedData = useMemo(() => {
    if (option) return option;
    if (!data?.data) return value ? [value] : [];
    const containsValue = data.data.some(
      (item) => item?.value === value?.value
    );
    return containsValue
      ? data.data
      : value
        ? [value, ...data.data]
        : data.data;
  }, [data, fieldNames, value, option]);

  return (
    <div className={`flex items-center border-border border  p-2 ${className && className}`}>
    {icons &&<div className="min-w-[24px]">  { icons && icons}</div>}
      <ComboboxDemo
        onOpenChange={(isopen) => {
          setOpen(isopen);
          setSearch(undefined);
        }}
        
        onFilter={isFilter ? debounce((e) => setSearch(e.target.value), 500):undefined}
        disabled={disabled}
        value={value?.value || QValue}
        className={"w-[90%] border-0"}
        isLoading={isLoading}
        options={isAll? [ {label:"все",value:undefined as unknown as string},...memoizedData]:memoizedData}
        
        placeholder={placeholder ? t(placeholder) : ""}
        onChange={(event) => {
         if(setValue)  setValue(event);
          setQValue(event?.value || "")
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
