import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { MyRoutes } from "./router";
import { getAllData } from "./service/apiHelpers";
import { apiRoutes } from "./service/apiRoutes";
import { useAuthStore } from "./store/auth-store";
import { useMeStore } from "./store/me-store";
import { IUserData } from "./types";

function App() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  const { setUserMe } = useMeStore();

  const {data}= useQuery({
    queryKey: ["useMe", token],
    queryFn: () => getAllData<IUserData, unknown>(apiRoutes.userMe),
    enabled: location.pathname != "/login" && Boolean(token),
  });
  useEffect(()=>{
   if(data) setUserMe(data)

  },[data])
  return <MyRoutes />;
}

export default App;

