import React, { useState } from "react";
import Image from "../../assets/Login_image.png";
import LoginImage from "../../assets/Logo-login.png";
import ImageMobile from "../../assets/ImageMobile.png";

import "../../app.css";
import TextField from "@mui/material/TextField";
import googleIcon from "../../assets/devicon_google.png";
import { useLoginForm } from "../../form/auth/Login/useLoginForm";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const LoginPage = () => {
  const [input, setInput] = useState();
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const {
    formik,
    showValues,
    loading,
    handleClickShowPassword,
    handleMouseDownPassword,
  } = useLoginForm();

  return (
    <Grid container direction="row" justifyContent="space-between">
      {isXsScreen && (
        <div style={{width:"100%",height:"200px"}}>
          <img
            src={ImageMobile}
            style={{
              height: "100%",
              width: "100%",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}
      <Box sx={{ width: isXsScreen?"100%":"55%", padding: "30px" }}>
        <div style={{ height: "37px", width: "150px" }}>
          <img
            src={LoginImage}
            alt="logo"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <div
          className="welcome"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: "0" }}>Welcome !</h1>
          <p style={{ marginBottom: "2rem" }}>
            The faster you fill up, the faster you get a ticket
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Typography variant="h6">Email *</Typography>
            <TextField
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              name="email"
              // label="E-mail"
              fullWidth
              variant="outlined"
              type="text"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
            <Typography variant="h6">Password *</Typography>
            <TextField
              required
              variant="outlined"
              // label="Password"
              name="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  formik.handleSubmit();
                  ev.preventDefault();
                }
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              type={showValues.showPassword ? "text" : "password"}
              sx={{ minWidth: "10vw", mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showValues.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Remember Me</Typography>
              <Typography variant="h6">Forget Password</Typography>
            </Box>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={() => formik.submitForm()}
              fullWidth
            >
              Login
            </LoadingButton>
          </div>
        </Box>
      </Box>
      {!isXsScreen && (
        <Box sx={{ width: "45%" }}>
          <img
            src={Image}
            style={{
              height: "100vh",
              width: "100%",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
      )}
    </Grid>
  );
};

export default LoginPage;
