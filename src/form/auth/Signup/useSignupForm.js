import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { signupSchema } from "./signupSchema";

export const useSignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showValues, setShowValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      setLoading(true);
      // No register endpoint wired yet — surface the intent and reset the flag.
      toast.success("Account details look good!");
      setTimeout(() => setLoading(false), 600);
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
    loading,
    showValues,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleMouseDownPassword,
  };
};
