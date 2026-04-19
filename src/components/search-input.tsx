import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import debounce from "@/utils/debounce";

export default function SearchInput({className}:{className?:string}) {
  const [search, setSearch] = useQueryState("search");
  const [id] = useQueryState("id");
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={` ${className && className} flex items-center bg-card rounded-xl gap-2.5`}>
      <Search />
      <input
        ref={inputRef}
        defaultValue={search || id || ""}
        onChange={debounce((e) => setSearch(e.target.value || null),500)}
        className="w-full outline-none"
        placeholder={t("search")}
      />
      <div>
        {search && (
          <X
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setSearch(null);
            }}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
