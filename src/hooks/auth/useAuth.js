import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from "../../api/auth/auth-api";
import { useAuth } from "../../context/AuthContext";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Where to land after authenticating, based on role.
const homeFor = (role) =>
  role === "SUPER_ADMIN" || role === "ADMIN" ? "/app" : "/app";

/*________________________LOGIN_____________________________________*/
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation((payload) => loginRequest(payload), {
    onSuccess: (data) => {
      login(data);
      toast.success("Welcome back!");
      navigate(homeFor(data?.userType), { replace: true });
    },
    onError: (error) => toast.error(errorMessage(error, "Login failed")),
  });
};

/*________________________SIGN UP___________________________________*/
export const useSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation((payload) => registerRequest(payload), {
    onSuccess: (data) => {
      login(data);
      toast.success("Account created successfully!");
      navigate(homeFor(data?.userType), { replace: true });
    },
    onError: (error) => toast.error(errorMessage(error, "Registration failed")),
  });
};

/*________________________LOGOUT____________________________________*/
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation(() => logoutRequest(), {
    // Clear locally regardless of the server outcome.
    onSettled: () => {
      logout();
      navigate("/login", { replace: true });
    },
  });
};
