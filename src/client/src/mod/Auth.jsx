import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
// import Divider from '@mui/joy/Divider';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
// import GoogleIcon from './GoogleIcon';
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function ColorSchemeToggle(props) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
        onClick?.(event);
      }}
      {...other}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function JoySignInSideTemplate() {
  const navigator = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const data = {
      kerberos: formElements.kerberos.value,
      password: formElements.password.value,
    };
    try {
      const res = await axios.post("http://localhost:3001/api/moderator/auth/login", data);
      if(res.status === 201)
      {
        toast.success("Logged in successfully");
        Cookies.set("token", res.data.token, { expires: 1 / 24 });
        Cookies.set("kerberos", formElements.kerberos.value, { expires: 1 / 24 });
        Cookies.set('mentId', res.data._id, { expires: 1 / 24 });
        navigator("/mod/");
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      toast.error("Invalid credentials");
    }
  };
  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <a href="https://bsw.iitd.ac.in/index.php">
                <IconButton variant="soft" color="primary" size="sm">
                  <img
                    src="https://bsw.iitd.ac.in/images/bsw_logo.png"
                    alt="BSW logo"
                    style={{ width: "200px", height: "50px" }}
                  />
                </IconButton>
              </a>
              {/* <Typography level="title-lg">BSW</Typography> */}
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Sign in
                </Typography>
                {/* <Typography level="body-sm">
                  New to company?{' '}
                  <Link href="#replace-with-a-link" level="title-sm">
                    Sign up!
                  </Link>
                </Typography> */}
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={(e) => handleSubmit(e)}
                // onSubmit={(event) => {
                //   event.preventDefault();
                //   const formElements = event.currentTarget.elements;
                //   const data = {
                //     kerberos: formElements.kerberos.value,
                //     password: formElements.password.value,
                //   };
                //   fetch("http://localhost:3001/api/login",{
                //     method: 'POST',
                //     headers: {
                //       'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data),
                //   }).then((response) => {
                //     if (response.ok) {
                //       toast.success('Logged in successfully');
                //       return response.json();
                //     }
                //     toast.error('Invalid credentials');
                //   }).then((data) => {
                //     Cookies.set('token', data.token, { expires: 1/24 });
                //     Cookies.set('kerberos', formElements.kerberos.value, { expires: 1/24 });
                //     navigator('../student');
                //   }
                //   ).catch((error) => {
                //     console.error('There has been a problem with your fetch operation:', error);
                //   });
                // }}
              >
                <FormControl required>
                  <FormLabel>kerberos</FormLabel>
                  <Input type="kerberos" name="kerberos" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={isStudent}
                      onChange={(event) => setIsStudent(event.target.checked)}
                      name="isStudent"
                    />
                  }
                  label="I am a student"
                /> */}
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                    {/* <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link> */}
                  </Box>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
              <Stack gap={4} sx={{ mt: 2 }}>
                <Typography level="body-sm">
                  New to the portal? <Link to={"/register"}>Register</Link>
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Your company {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(https://bsw.iitd.ac.in/images/carousel2.jpg)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: "url(https://bsw.iitd.ac.in/images/carousel3.png)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
