import HomePageBoss from ".";

const Route = [
  {
    url: "/boss/annual",
    Element: HomePageBoss,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
