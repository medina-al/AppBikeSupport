import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Impor all components
//import Cars from "./components/Cars/Cars";
import Login from "./components/Login/Login";
import Navigation from "./components/Navigation/Navigation";
import Assists from "./components/Assists/Assists";
import Users from "./components/Users/Users";

import "./App.css";

function App() {

  //Validate session expired
  const navigate = useNavigate();
  
  const validateSession = async () => {
    if(document.cookie=='' || document.cookie==undefined){
      navigate('/');
    }
  };
  useEffect(() => { 
    validateSession();
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Navigation />}>
          <Route path="asistencias" element={<Assists />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
