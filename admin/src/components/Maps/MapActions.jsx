import { useContext } from "react";
// Material resources
import { Box, Stack, Icon, IconButton, Tooltip } from "@mui/material";
//Custom resources
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";

function MapActions(params) {
  //Dialog variable context
  const { handleOpen } = useContext(GeneralContext);

  return (
    <>
      <Box>
        <Stack direction="row" spacing={0.1}>
          <Tooltip title="Editar Mapa">
            <IconButton
              aria-label="Editar Mapa"
              component="label"
              onClick={() =>
                handleOpen("Editar Mapa", "../components/Maps/MapEdit", params)
              }
            >
              <Icon sx={{ color: redFF }}>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Crear Punto de Mapa">
            <IconButton
              aria-label="Crear Punto de Mapa"
              component="label"
              onClick={() =>
                handleOpen("Crear Punto de Mapa", "../components/Maps/MapPointCreate", params)
              }
            >
              <Icon sx={{ color: redFF }}>add_location_alt</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Gestionar Puntos de Mapa">
            <IconButton
              aria-label="Gestionar Puntos de Mapa"
              component="label"
              onClick={() =>
                handleOpen("Gestionar Puntos de Mapa", "../components/Maps/MapPoints", params)
              }
            >
              <Icon sx={{ color: redFF }}>edit_location_alt</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
} 

export default MapActions;
