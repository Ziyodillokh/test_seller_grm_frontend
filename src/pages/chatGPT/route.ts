import ChatGPT from ".";

const Route = [
  {
    url: "/chatGPT",
    Element: ChatGPT,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
