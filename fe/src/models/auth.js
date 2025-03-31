import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useCallback } from "react";

export const useAuthenticatedApi = () => {
  const { getToken } = useAuth();
  const authenticatedApi = useCallback(async (endpoint, options = {}) => {
    const baseURL = import.meta.env.VITE_BE_API_URL;

    if (!baseURL) {
      throw new Error("Base URL is not defined in the environment variables.");
    }

    const token = await getToken();

    return axios({
      method: options.method || "GET",
      url: `${baseURL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      data: options.data || null,
      params: options.params || null,
    });
  }, []);

  return authenticatedApi;
};
