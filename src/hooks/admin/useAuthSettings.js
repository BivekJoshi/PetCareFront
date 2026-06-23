import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { fetchAuthSettings, updateAuthSettings } from "../../api/admin/admin-api";

const KEY = "auth-settings";

export const useAuthSettings = (options = {}) =>
  useQuery([KEY], fetchAuthSettings, options);

export const useAuthSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateAuthSettings, {
    onSuccess: () => {
      // Refresh both the admin view and the public auth-config the banners read.
      queryClient.invalidateQueries(KEY);
      queryClient.invalidateQueries(["auth-config"]);
      toast.success("Verification settings saved");
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Something went wrong"),
  });
};
