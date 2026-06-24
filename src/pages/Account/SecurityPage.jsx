import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PageHeader from "../../components/common/PageHeader";
import AvatarUploader from "../../components/common/AvatarUploader";
import { useAuth } from "../../context/AuthContext";
import { usePassword } from "../../hooks/auth/usePassword";
import { fullName } from "../../utility/format";
import { humanize } from "../../constants/domain";

// Reusable password input with a show/hide toggle.
const PasswordField = ({ label, value, onChange, error, onEnter, autoFocus }) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      error={Boolean(error)}
      helperText={error || " "}
      autoFocus={autoFocus}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              size="small"
            >
              {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

/**
 * Account security page. Lets a signed-in user either:
 *   • set a password — when their account has none yet (signed up with Google), or
 *   • change their password — when one already exists (needs the current one).
 * Which form shows is driven by the stored user's `hasPassword` flag.
 */
const SecurityPage = () => {
  const { user, role } = useAuth();
  const { setPassword, changePassword } = usePassword();
  const hasPassword = Boolean(user?.hasPassword);
  const busy = setPassword.isLoading || changePassword.isLoading;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (hasPassword && !current) e.current = "Enter your current password";
    if (next.length < 6) e.next = "Password must be at least 6 characters";
    if (confirm !== next) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (busy || !validate()) return;
    if (hasPassword) {
      changePassword.mutate(
        { currentPassword: current, newPassword: next, confirmPassword: confirm },
        { onSuccess: reset }
      );
    } else {
      setPassword.mutate(
        { password: next, confirmPassword: confirm },
        { onSuccess: reset }
      );
    }
  };

  return (
    <Box>
      <PageHeader
        title="Password & Security"
        subtitle={
          hasPassword
            ? "Update the password you use to sign in."
            : "Add a password so you can sign in with your email and password too."
        }
      />

      {/* Profile identity + photo */}
      <Card variant="outlined" sx={{ borderRadius: 3, maxWidth: 520, mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <AvatarUploader size={64} fallback="U" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                {fullName(user) || "Your account"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {humanize(role || "")} · Tap the photo to change it
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, maxWidth: 520 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
            <LockOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {hasPassword ? "Change password" : "Set a password"}
            </Typography>
          </Stack>

          {!hasPassword && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Your account uses Google sign-in. You don&apos;t need a password — but
              adding one lets you sign in with your email and password as well.
            </Alert>
          )}

          <Stack spacing={1}>
            {hasPassword && (
              <PasswordField
                label="Current password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                error={errors.current}
                autoFocus
              />
            )}
            <PasswordField
              label={hasPassword ? "New password" : "Password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              error={errors.next}
              autoFocus={!hasPassword}
            />
            <PasswordField
              label="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              onEnter={submit}
            />

            <Box>
              <LoadingButton
                loading={busy}
                variant="contained"
                size="large"
                onClick={submit}
                sx={{ py: 1.1, px: 3, mt: 1 }}
              >
                {hasPassword ? "Update password" : "Set password"}
              </LoadingButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SecurityPage;
