import VoiceChat from ".";

const Route = [
  {
    url: "/voiceChat",
    Element: VoiceChat,
    meta: { isAuth: true, role: new Set(["admin"]) },
  },
];

export default Route;
