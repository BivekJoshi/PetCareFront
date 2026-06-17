import { useState } from "react";
import { useFormik } from "formik";
import { signupSchema } from "./signupSchema";
import { useSignup } from "../../../hooks/auth/useAuth";

// "Jane Mary Doe" -> { firstName: "Jane", lastName: "Mary Doe" }
const splitName = (fullName) => {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") || first };
};

export const useSignupForm = () => {
  const [showValues, setShowValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const { mutate, isLoading } = useSignup();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: ({ fullName, email, password }) => {
      const { firstName, lastName } = splitName(fullName);
      mutate({ firstName, lastName, email: email.trim(), password: password.trim() });
    },
  });

  const handleClickShowPassword = () =>
    setShowValues((s) => ({ ...s, showPassword: !s.showPassword }));

  const handleClickShowConfirmPassword = () =>
    setShowValues((s) => ({
      ...s,
      showConfirmPassword: !s.showConfirmPassword,
    }));

  const handleMouseDownPassword = (event) => event.preventDefault();

  return {
    formik,
    loading: isLoading,
    showValues,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleMouseDownPassword,
  };
};
