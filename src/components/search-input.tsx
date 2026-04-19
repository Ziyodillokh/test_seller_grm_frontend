import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchInput({className}:{className?:string}) {
  const [search, setSearch] = useQueryState("search");
  const [id] = useQueryState("id");
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(search || id || "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = (val: string) => {
    setInputValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(val || null);
    }, 500);
  };

  const handleClear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setInputValue("");
    setSearch(null);
  };

  return (
    <div className={` ${className && className} flex items-center bg-card rounded-xl gap-2.5`}>
      <Search />
      <input
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full outline-none"
        placeholder={t("search")}
      />
      <div>
        {(search || inputValue) && (
          <X
            onClick={handleClear}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
