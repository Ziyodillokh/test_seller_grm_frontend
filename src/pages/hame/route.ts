import HomePage from ".";

const Route = [
  {
    url: "/home",
    Element: HomePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/home/transfer",
    Element: HomePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },

];

export default Route;
