import ProductCheckPage from ".";

const Route = [
  {
    url: "/new-qr-code",
    Element: ProductCheckPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
