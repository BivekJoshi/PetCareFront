import { useNavigate } from "react-router-dom";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StatusScreen from "../../components/Errorboundary/StatusScreen";
import { useAuth } from "../../context/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If the user simply isn't signed in, point them at the login flow;
  // otherwise they're signed in but lack the role for the page.
  const primaryAction = isAuthenticated
    ? {
        label: "Back to dashboard",
        onClick: () => navigate("/app"),
        icon: <HomeRoundedIcon />,
      }
    : {
        label: "Sign in",
        onClick: () => navigate("/login"),
        icon: <LoginRoundedIcon />,
      };

  return (
    <StatusScreen
      code="401"
      icon={<LockRoundedIcon />}
      title="Access denied"
      message={
        isAuthenticated
          ? "You don't have permission to view this page. Contact an administrator if you think this is a mistake."
          : "You need to be signed in to view this page."
      }
      primaryAction={primaryAction}
      secondaryAction={{
        label: "Go home",
        onClick: () => navigate("/"),
        icon: <HomeRoundedIcon />,
      }}
    />
  );
};

export default UnauthorizedPage;
