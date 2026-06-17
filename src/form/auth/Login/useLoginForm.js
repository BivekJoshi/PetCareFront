import { useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "./loginSchema";
import { useLogin } from "../../../hooks/auth/useAuth";

export const useLoginForm = () => {
  const [showValues, setShowValues] = useState({ showPassword: false });
  const { mutate, isLoading } = useLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: ({ email, password }) =>
      mutate({ email: email.trim(), password: password.trim() }),
  });

  const handleClickShowPassword = () =>
    setShowValues((s) => ({ ...s, showPassword: !s.showPassword }));

  const handleMouseDownPassword = (event) => event.preventDefault();

  return {
    formik,
    showValues,
    loading: isLoading,
    handleClickShowPassword,
    handleMouseDownPassword,
  };
};
