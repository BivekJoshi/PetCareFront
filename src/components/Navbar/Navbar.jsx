import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Badge, Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/YejuLogo.png";
import ResButton from "../ResponsiveComponent/ResButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCartList } from "../../utility/cookieHelper";

function Navbar({ data }) {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [activePage, setActivePage] = React.useState("/home");
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const cartItems = getCartList();
  const navItem = [
    {
      id: 1,
      item: "Home",
      path: "/home",
    },
    {
      id: 2,
      item: "About Us",
      path: "/aboutUs",
    },
    {
      id: 3,
      item: "Gallery",
      path: "/gallery",
    },
    {
      id: 4,
      item: "Testimonials",
      path: "/testimonials",
    },
    {
      id: 5,
      item: "Notice",
      path: "/notice",
    },
  ];

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleActiveClick = (path, child) => {
    navigate(`${path}`);
    setActivePage(path);
  };
  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };
  const handleClickChangePassword = () => {
    navigate(`/change-password`);
    handleCloseProfile();
  };
  const handleClickProfile = () => {
    if (data?.userType === "ADMIN") {
      navigate(`/adminProfile`);
    } else if (data?.userType === "STUDENT") {
      navigate(`/Profile`);
    } else {
      navigate(`/superAdminProfile`);
    }

    handleCloseProfile();
  };
  const handleClickLogout = () => {
    // removeUser();
    navigate(`/`);
    handleCloseProfile();
  };

  return (
    <Box sx={{ background: theme.palette.primary.main, maxWidth: "100%" }}>
      <Container maxWidth="100%">
        <Toolbar>
          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
                justifyContent: "space-between",
              },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navItem.map((page) => (
                <MenuItem
                  key={page?.id}
                  onClick={(event) => {
                    handleActiveClick(page?.path, page?.subLinks);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center" variant="h5">
                    {page?.item}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <div style={{ width: "85px" }}>
              <img
                src={Logo}
                alt="Yeju Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                height: "48px",
                display: { xs: "none", md: "flex" },
              }}
            >
              <img
                src={Logo}
                alt="Yeju Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "2rem",
                  alignItems: "center",
                  marginRight: "2rem",
                },
              }}
            >
              {navItem.map((page) => (
                <Typography
                  key={page?.id}
                  onClick={(event) => {
                    handleActiveClick(page?.path, page?.subLinks);
                  }}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textTransform: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                    borderBottom:
                      activePage === page?.path ? "5px solid orange" : "none",
                    "&:hover": {
                      transform: "scale(1.2)",
                      transition: "transform 0.2s ease-in-out",
                      fontWeight: "bold",
                    },
                  }}
                >
                  {page?.item}
                </Typography>
              ))}
            </Box>
            <Button sx={{ color: 'black' }} onClick={() => navigate("wish-list")}>
              <Badge badgeContent={cartItems?.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </Button>
            <Box
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "flex-end",
              }}
            >
              <ResButton
                onClick={() => navigate("/login")}
                backgroundColor={theme.palette.primary.alt}
                content="Login"
              />
              <ResButton
                onClick={() => navigate("/register")}
                backgroundColor={theme.palette.primary.alt}
                content="Register"
                variant="outlined"
              />
            </Box>
          </div>
        </Toolbar>
      </Container>
    </Box>
  );
}
export default Navbar;
