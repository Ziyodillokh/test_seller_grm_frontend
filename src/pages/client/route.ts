import ClientList from "./list";
import SingleCliennt from "./single";

const Route = [
  {
    url: "/client",
    Element: ClientList,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/client/:id",
    Element: SingleCliennt,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

];

export default Route;
