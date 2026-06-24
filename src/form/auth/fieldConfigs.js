import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

/**
 * Declarative field definitions for every auth form. Each entry is consumed by
 * `RenderInput` / `RenderForm`, so adding or reordering a field is a data edit —
 * no JSX duplication. `grid` spans columns; `visibilityKey` maps a password
 * field to its show/hide toggle; `submitOnEnter` submits the form on Enter.
 */

export const loginFields = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    icon: MailOutlineIcon,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    visibilityKey: "showPassword",
    submitOnEnter: true,
  },
];

export const signupFields = [
  {
    name: "fullName",
    type: "text",
    label: "Full name",
    placeholder: "Jane Doe",
    icon: PersonOutlineIcon,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    icon: MailOutlineIcon,
  },
  {
    name: "phone",
    type: "phone",
    label: "WhatsApp number",
    placeholder: "+9779812345678",
    icon: PhoneIphoneIcon,
    helperText: "Include country code — we'll send a verification code here",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    visibilityKey: "showPassword",
    grid: { xs: 12, sm: 6 },
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm password",
    placeholder: "Re-enter your password",
    visibilityKey: "showConfirmPassword",
    submitOnEnter: true,
    grid: { xs: 12, sm: 6 },
  },
];

export const forgotRequestFields = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    icon: MailOutlineIcon,
    autoFocus: true,
    submitOnEnter: true,
  },
];

export const forgotResetFields = [
  {
    name: "code",
    type: "code",
    label: "Reset code",
    placeholder: "••••••",
    autoFocus: true,
    inputProps: {
      inputMode: "numeric",
      maxLength: 6,
      style: { letterSpacing: "0.4em", fontWeight: 700 },
    },
  },
  {
    name: "password",
    type: "password",
    label: "New password",
    placeholder: "Create a new password",
    visibilityKey: "showPw",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm password",
    placeholder: "Re-enter your new password",
    visibilityKey: "showPw",
    submitOnEnter: true,
  },
];
