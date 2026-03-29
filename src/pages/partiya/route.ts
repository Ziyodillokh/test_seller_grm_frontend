
import ActionPage from "./form";
import PartiyaList from "./list";

const Route = [
  {
    url: "/partiya",
    Element: PartiyaList,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/partiya/:id",
    Element: ActionPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

];

export default Route;
