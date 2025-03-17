import { axiosInstance } from "@/lib/axios";

export const api = {
  get: <T>(url: string) => axiosInstance.get<T>(url),
  post: <T>(url: string, body: unknown) => axiosInstance.post<T>(url, body),
  patch: <T>(url: string, body: unknown) => axiosInstance.patch<T>(url, body),
  delete: <T>(url: string) => axiosInstance.delete<T>(url),
};
