import ProductCheckPage from ".";

const Route = [
  {
    url: "/product-check",
    Element: ProductCheckPage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
