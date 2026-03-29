import BronPage from ".";

const Route = [
  {
    url: "/bron",
    Element: BronPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
