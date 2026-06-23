import { useMutation } from "react-query";
import toast from "react-hot-toast";
import {
  setPasswordRequest,
  changePasswordRequest,
} from "../../api/auth/auth-api";
import { useAuth } from "../../context/AuthContext";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Mutations for managing the signed-in user's password:
 *   • setPassword    — add a password to an OAuth account that has none.
 *   • changePassword — replace an existing password (needs the current one).
 * Both refresh `hasPassword` on the stored user so the UI updates immediately.
 */
export const usePassword = () => {
  const { updateUser } = useAuth();

  const onUserPatch = (data) => {
    if (data?.user) updateUser(data.user);
  };

  const setPassword = useMutation(
    (payload) => setPasswordRequest(payload),
    {
      onSuccess: (data) => {
        onUserPatch(data);
        toast.success("Password set — you can now sign in with email & password too");
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Could not set your password")),
    }
  );

  const changePassword = useMutation(
    (payload) => changePasswordRequest(payload),
    {
      onSuccess: (data) => {
        onUserPatch(data);
        toast.success("Password updated");
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Could not update your password")),
    }
  );

  return { setPassword, changePassword };
};
