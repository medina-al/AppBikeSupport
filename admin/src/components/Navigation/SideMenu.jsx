import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Material resources
import Divider from "@mui/material/Divider";
import Icon from '@mui/material/Icon';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import Toolbar from "@mui/material/Toolbar";
// Custom resources
import { toolbar, menuList, redFF } from "../shared/styles/MUIStyles";

export default function SideMenu(props) {
  
  const location = useLocation();
  const path = location.pathname;
  const [menus, setMenus] = useState([
    {
      name: "Inicio",
      route: "/index",
      icon: "home"
    },
    {
      name: "Asistencias",
      route: "/index/asistencias",
      icon: "support_agent"
    },
    {
      name: "Recomendaciones",
      route: "/recomendaciones",
      icon: "recommend"
    },
  ]);

  useEffect(() => { 
  }, []);
  const RenderMenus = menus.map((menu, index) => (
    <div key={index}>
      <ListItem key={index} disablePadding component={Link} to={menu.route}>
        <ListItemButton selected={menu.route===path} sx={{ "&.Mui-selected": { color: redFF } }}>
          <ListItemIcon>
            <Icon color="secondary">{menu.icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={menu.name} />
        </ListItemButton>
      </ListItem>
    </div>
  ));

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/index");
  }
  return (
    <div>
      <Toolbar style={toolbar} onClick={goToHome}>
        <img
          className="w-50 mx-auto"
          src="/logo_solo_texto.png"
          alt="App Bike Support Logo"
        />
      </Toolbar>
      <List style={menuList}>
        <Divider></Divider>
        {RenderMenus}
        <ListItem disablePadding component={Link} to="/">
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              style={redFF}
              sx={{ "& .MuiTypography-root": { fontWeight: "bolder" } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}