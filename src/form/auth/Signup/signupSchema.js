import * as Yup from "yup";

const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name is too short")
    .required("Full name is required"),
  email: Yup.string()
    .email("Enter valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^\+?[1-9]\d{7,14}$/,
      "Enter a valid phone number with country code (e.g. +9779812345678)"
    )
    .required("WhatsApp number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

export { signupSchema };
