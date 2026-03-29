import ChatUI from ".";

const Route = [
  {
    url: "/chat",
    Element: ChatUI,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
