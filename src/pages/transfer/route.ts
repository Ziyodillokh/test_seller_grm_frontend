import ProductCheckPage from ".";
import TrasferListPage from "./list";

const Route = [
  {
    url: "/transfer",
    Element: ProductCheckPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/transfer/list",
    Element: TrasferListPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
