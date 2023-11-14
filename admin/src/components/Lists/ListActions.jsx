import { useContext } from "react";
// Material resources
import { Box, Stack, Icon, IconButton, Tooltip } from "@mui/material";
//Custom resources
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";

function ListActions(params) {
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
                handleOpen("Editar Mapa", "../components/Lists/ListEdit", params)
              }
            >
              <Icon sx={{ color: redFF }}>edit</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
} 

export default ListActions;
