import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import StatusScreen from "../../components/Errorboundary/StatusScreen";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <StatusScreen
      code="404"
      icon={<TravelExploreRoundedIcon />}
      title="Page not found"
      message="The page you're looking for doesn't exist or may have been moved."
      primaryAction={{
        label: "Back home",
        onClick: () => navigate("/"),
        icon: <HomeRoundedIcon />,
      }}
      secondaryAction={{
        label: "Go back",
        onClick: () => navigate(-1),
        icon: <ArrowBackRoundedIcon />,
      }}
    />
  );
};

export default NotFoundPage;
