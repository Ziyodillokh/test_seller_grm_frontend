import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

import debounce from "@/utils/debounce";

export default function SearchInput({className}:{className?:string}) {
  const [search, setSearch] = useQueryState("search");
  const [id] = useQueryState("id");
  const { t } = useTranslation();

  return (
    <div className={` ${className && className} flex items-center bg-card rounded-xl gap-2.5`}>
      <Search />
      <input
        // value={search || id || ""}
        defaultValue={search || id || ""}
        onChange={debounce((e) => setSearch(e.target.value),500)}
        className="w-full outline-none"
        placeholder={t("search")}
      />
      <div>
        {search && (
          <X
            onClick={() => setSearch("")}
            className={search ? "cursor-pointer" : "opacity-40"}
          />
        )}
      </div>
    </div>
  );
}
