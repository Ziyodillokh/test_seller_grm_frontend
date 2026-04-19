import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import debounce from "@/utils/debounce";

export default function SearchInput({className}:{className?:string}) {
  const [search, setSearch] = useQueryState("search");
  const [id] = useQueryState("id");
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(search || id || "");

  // URL dan search o'zgarganda inputni sync qilish
  useEffect(() => {
    setInputValue(search || id || "");
  }, [search, id]);

  const debouncedSearch = useCallback(
    debounce((val: string) => setSearch(val || null), 500),
    []
  );

  return (
    <div className={` ${className && className} flex items-center bg-card rounded-xl gap-2.5`}>
      <Search />
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="w-full outline-none"
        placeholder={t("search")}
      />
      <div>
        {search && (
          <X
            onClick={() => {
              setInputValue("");
              setSearch(null);
            }}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
