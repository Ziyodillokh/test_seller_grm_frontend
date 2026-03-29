import CarpetSinglePage from "./single";

const Route = [
  {
    url: "/carpet/:id",
    Element: CarpetSinglePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
