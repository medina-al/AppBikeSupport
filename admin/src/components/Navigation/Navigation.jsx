import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
// Material resources
import AppBar from "@mui/material/AppBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideMenu from "./SideMenu";
import { Stack } from "@mui/material";
// Custom resources
import { navBar, containerBox } from "../shared/styles/MUIStyles";
import Index from "../Index/Index";
import { getCookie } from "../../services/user";
import { GeneralContextProvider } from "../../context/GeneralContext";

const drawerWidth = 250;

export default function Navigation(props) {
  //Get global values from cookies
  const [names, setFirstName] = useState();
  const [lastnames, setLastnames] = useState();

  const GetCookie = async () => {
    const names = await getCookie("names");
    const lastnames = await getCookie("lastnames");
    if (names != "") {
      setFirstName(names);
    } else {
      navigate("/");
    }
    if (lastnames != "") {
      setLastnames(lastnames);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    GetCookie();
  }, [GetCookie]);

  //Set if device is mobile or desktopo
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //Redirect logout
  const navigate = useNavigate();

  const Logout = () => {
    navigate("/");
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "red",
        }}
        style={navBar}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack spacing={0.3}>
            <Typography variant="paragraph" color="secondary">
              Bienvenido
            </Typography>
            <Typography variant="h6">
              {names} {lastnames}
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <AccountCircleIcon></AccountCircleIcon>
            </IconButton>
          </Box>
          <IconButton onClick={Logout}>
            <LogoutIcon sx={{ color: "primary.light" }}></LogoutIcon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "black",
            },
          }}
        >
          <SideMenu></SideMenu>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "black",
            },
          }}
          open
        >
          <SideMenu></SideMenu>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0.1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "rgba(0,0,0,0)",
          margin: "0px",
        }}
        style={containerBox}
      >
        <br />
        <br />
        <br />
        <Box
          sx={{
            height: "10px",
            display: { md: "none", lg: "none", xl: "none" },
          }}
        />
        <GeneralContextProvider>
          <Outlet></Outlet>
        </GeneralContextProvider>
        <Index />
      </Box>
    </Box>
  );
}
