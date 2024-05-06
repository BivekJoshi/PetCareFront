import { useState } from "react";
import { loginSchema } from "./loginSchema";
import { useLogin } from "../../../hooks/auth/useAuth";
import { useFormik } from "formik";

export const useLoginForm = () => {
  
  const [loading, setLoading] = useState(false);
  const [showValues, setShowValues] = useState({
    password: "",
    showPassword: false,
  });
  const { mutate } = useLogin({});
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      setLoading(true);
        handleLogin(values);
        console.log(values);
    },
  });

  const handleLogin = (values) => {
    const { email, password } = values;

    const trimmedPassword = password.trim();
    mutate(
      { email, password: trimmedPassword },
      { onSettled: () => setLoading(false) }
    );
  };

  const handleClickShowPassword = () => {
    setShowValues({
      ...showValues,
      showPassword: !showValues.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return {
    handleLogin,
    formik,
    showValues,
    loading,
    handleMouseDownPassword,
    handleClickShowPassword,
  };
};
