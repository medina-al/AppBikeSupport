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
    <Box height="80vh" display="flex" sx={{padding: '3%', backgroundColor: grayFFTr, borderRadius: "15px"}}>
       <img
          className="w-50 mx-auto"
          src="/logo_texto.png"
          alt="App Bike Support Logo"
        />
    </Box>
  );
}

export default Index;
