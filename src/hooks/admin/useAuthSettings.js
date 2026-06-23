import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { fetchAuthSettings, updateAuthSettings } from "../../api/admin/admin-api";

const KEY = "auth-settings";

export const useAuthSettings = (options = {}) =>
  useQuery([KEY], fetchAuthSettings, options);

export const useAuthSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateAuthSettings, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(KEY);
      toast.success(
        data?.otpEnabled
          ? "WhatsApp OTP verification turned ON"
          : "WhatsApp OTP verification turned OFF"
      );
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Something went wrong"),
  });
};
