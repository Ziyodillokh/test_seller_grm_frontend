import ReportPage from ".";

const Route = [
  {
    url: "/reports",
    Element: ReportPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
