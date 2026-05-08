import { parseAsString, useQueryState } from "nuqs";
import { useLocation, useNavigate } from "react-router-dom";

const data = [
  { label: "Mahsulotlar", value: "Mahsulotlar", pathname: "/transfer" },
  { label: "Transfer", value: "all", pathname: "/transfer/list" },
];

export default function TabBar() {
  const [, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("Mahsulotlar")
  );
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="grid grid-cols-2 sticky top-[118px] w-full max-w-[500px] bg-background z-10"
    >
      {data?.map((e) => (
        <p
          key={e.value}
          onClick={() => {
            setTab(e?.value);
            if (e?.value == "Mahsulotlar") {
              navigate("/transfer");
            } else {
              navigate("/transfer/list");
            }
          }}
          className={`${e.pathname == location.pathname ? "bg-primary text-primary-foreground" : "text-primary "}  inline-block cursor-pointer text-nowrap px-5 py-[11px] border-border border  text-center`}
        >
          {e?.label}
        </p>
      ))}
    </div>
  );
}
