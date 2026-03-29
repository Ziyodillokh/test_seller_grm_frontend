import { parseAsString, useQueryState } from "nuqs";
import { useLocation, useNavigate, useParams } from "react-router-dom";



export default function TabBar() {
  const {id}= useParams() 

  const data = [
    { label: "Сканирование", value: "Сканирование", pathname: `/partiya/${id}` },
    { label: "Оприходован", value: "переучет", pathname: `/partiya/${id}/table` },
    { label: "Излишки", value: "излишки", pathname: `/partiya/${id}/table` },
    { label: "Дефицит", value: "дефицит", pathname: `/partiya/${id}/table` },
  ];
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("Сканирование")
  );
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      //  className="flex costomScroll overflow-auto "
      className="flex overflow-scroll w-full"
    >
      {data?.map((e) => (
        <p
          key={e.value}
          onClick={() => {
            setTab(e?.value);
            if (e?.value == "Сканирование") {
              navigate(`/partiya/${id}`);
            } else {
              navigate(`/partiya/${id}/table`);
            }
          }}
          className={`${e.pathname == location.pathname && e?.value == tab ? "bg-primary text-primary-foreground" : "text-primary "}   inline-block cursor-pointer text-nowrap px-5 py-[11px] border-border border  text-center`}
        >
          {e?.label}
        </p>
      ))}
    </div>
  );
}
