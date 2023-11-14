import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// Material resources
import { Box } from "@mui/material";
//API services
import { grayFFTr } from "../shared/styles/MUIStyles";

function Index() {
  //Call initial functions for festivals list and get cookies
  useEffect(() => {
    
  }, []);  

  //Don't show Index view if other component is open
  const { pathname } = useLocation();
  if (pathname != "/index") {
    return <></>;
  }
  return (
    <Box display="flex" sx={{padding: '3%', backgroundColor: grayFFTr, borderRadius: "15px"}}>
       <img
          className="mx-auto"
          src="/logo_texto.png"
          alt="App Bike Support Logo"
          style={{width: "50%"}}
        />
    </Box>
  );
}

export default Index;
