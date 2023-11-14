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
import { getCookie } from "../../services/user";

export default function SideMenu(props) {
  const [type, setType] = useState();
  const GetCookie = async () => {
    const userType = await getCookie("userType");
    if (userType != "") {
      setType(userType);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    GetCookie();
  }, [GetCookie]);

  const location = useLocation();
  const path = location.pathname;
  const [menus, setMenus] = useState([
    {
      name: "Inicio",
      route: "/index",
      icon: "home",
    },
    {
      name: "Aliados",
      route: "/index/aliados",
      icon: "store",
      type: 'ADMINISTRADOR'
    },
    {
      name: "Asistencias",
      route: "/index/asistencias",
      icon: "support_agent",
      type: 'ADMINISTRADOR'
    },    
    {
      name: "Listas desplegables",
      route: "/index/listas",
      icon: "format_list_bulleted",
      type: 'ADMINISTRADOR'
    },
    {
      name: "Mapas",
      route: "/index/mapas",
      icon: "map",
      type: 'ADMINISTRADOR'
    },

    {
      name: "Mi tienda",
      route: "/index/miTienda",
      icon: "local_mall",
      type: 'ALIADO'
    },
    {
      name: "Recomendaciones",
      route: "/index/recomendaciones",
      icon: "recommend",
      type: 'ADMINISTRADOR'
    },
  ]);

  const RenderMenus = menus.map((menu, index) => {
    // Si menu.type es igual a type o menu.type está vacío, muestra el menú
    if (menu.type === type || !menu.type) {
      return (
        <div key={index}>
          <ListItem key={index} disablePadding component={Link} to={menu.route}>
            <ListItemButton selected={menu.route === path} sx={{ "&.Mui-selected": { color: redFF } }}>
              <ListItemIcon>
                <Icon color="secondary">{menu.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={menu.name} />
            </ListItemButton>
          </ListItem>
        </div>
      );
    } else {
      // Si menu.type no es igual a type y tampoco está vacío, no mostrar el menú
      return null;
    }
  });

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