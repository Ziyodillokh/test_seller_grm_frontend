import HomePageBoss from ".";

const Route = [
  {
    url: "/boss/profile",
    Element: HomePageBoss,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
