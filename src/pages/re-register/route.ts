import ActionPage from "./form";

const Route = [
  {
    url: "/re-report",
    Element: ActionPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
