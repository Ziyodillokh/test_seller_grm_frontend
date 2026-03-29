import CheckPage from "./check";
import BasketPage from "./list";


const Route = [
  {
    url: "/basket",
    Element: BasketPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/basket/check",
    Element: CheckPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
