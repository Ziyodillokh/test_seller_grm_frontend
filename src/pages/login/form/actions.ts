import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { AddData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { LoginFormType } from "./schema";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    firstName: string;
    role: number;
  };
}
const useAuthMutation = ({
  ...options
}: UseMutationOptions<AuthResponse, Error, LoginFormType, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async (data) => {
      return await AddData<LoginFormType>(apiRoutes.login, {
        login: data.login,
        password: data.login,
      });
    },
  });

export default useAuthMutation;
