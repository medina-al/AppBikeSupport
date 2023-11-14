import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Import all components
import { LoadScript } from "@react-google-maps/api";
const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import Login from "./components/Login/Login";
import Navigation from "./components/Navigation/Navigation";
import Allies from "./components/Allies/Allies";
import Ally from "./components/Allies/Ally";
import Assists from "./components/Assists/Assists";
import Lists from "./components/Lists/Lists";
import Maps from "./components/Maps/Maps";
import Recommendations from "./components/Recommendations/Recommendations";
import Users from "./components/Users/Users";

import "./App.css";


function App() {

  //Validate session expired
  const navigate = useNavigate();

  const validateSession = async () => {
    if (document.cookie == '' || document.cookie == undefined) {
      navigate('/');
    }
  };
  useEffect(() => {
    validateSession();
  }, []);
  return (
    <div>
      <LoadScript googleMapsApiKey={mapsApiKey}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/index" element={<Navigation />}>
            <Route path="aliados" element={<Allies />} />
            <Route path="asistencias" element={<Assists />} />
            <Route path="mapas" element={<Maps />} />
            <Route path="miTienda" element={<Ally />} />
            <Route path="recomendaciones" element={<Recommendations />} />
            <Route path="listas" element={<Lists />} />
          </Route>
        </Routes>
      </LoadScript>
    </div>
  );
}

export default App;
