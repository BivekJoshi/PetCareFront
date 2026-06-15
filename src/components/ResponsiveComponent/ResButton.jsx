import { Button, useTheme } from "@mui/material";

/**
 * Shared button that scales down on small screens.
 *
 * When an explicit `variant` is passed the MUI default colours for that
 * variant are used; otherwise it renders a contained button tinted with
 * `backgroundColor`.
 */
const ResButton = ({
  variant,
  endIcon,
  backgroundColor,
  color,
  content,
  onClick,
  borderColor,
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant || "contained"}
      endIcon={endIcon}
      onClick={onClick}
      sx={{
        backgroundColor: variant ? undefined : backgroundColor,
        color: color || "white",
        borderColor: borderColor || theme.palette.primary.alt,
        fontWeight: 700,
        height: { xs: "28px", md: "auto" },
        fontSize: { xs: "8px", md: "0.875rem" },
        padding: { xs: "3px", md: "6px 16px" },
      }}
    >
      {content}
    </Button>
  );
};

export default ResButton;
