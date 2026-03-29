import QrCodePage from ".";

const Route = [
  {
    url: "/qr-code",
    Element: QrCodePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
  {
    url: "/qr-code-report",
    Element: QrCodePage,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
