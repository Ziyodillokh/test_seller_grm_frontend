import ProfilePage from ".";

const Route = [
  {
    url: "/profile",
    Element: ProfilePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
