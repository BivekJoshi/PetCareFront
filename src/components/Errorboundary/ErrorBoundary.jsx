import { Component } from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import StatusScreen from "./StatusScreen";

/**
 * Catches render-time errors anywhere in the wrapped tree and shows a
 * friendly fallback instead of a blank white screen. Class component because
 * `getDerivedStateFromError` / `componentDidCatch` have no hook equivalent.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface the crash to the console (and any wired-up reporting) so it
    // isn't swallowed silently by the boundary.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // HashRouter lives under the "#" — reset the hash and reload so we land
    // on a clean tree even if routing state was part of the failure.
    window.location.assign("/#/");
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;

    if (!hasError) {
      return this.props.children;
    }

    const details =
      import.meta.env.DEV && error
        ? error.stack || error.message || String(error)
        : null;

    return (
      <StatusScreen
        icon={<ReportProblemRoundedIcon />}
        title="Something went wrong"
        message="An unexpected error occurred while rendering this page. You can try reloading, or head back to the home page."
        details={details}
        primaryAction={{
          label: "Reload page",
          onClick: this.handleReload,
          icon: <RefreshRoundedIcon />,
        }}
        secondaryAction={{
          label: "Go home",
          onClick: this.handleGoHome,
          icon: <HomeRoundedIcon />,
        }}
      />
    );
  }
}

export default ErrorBoundary;
