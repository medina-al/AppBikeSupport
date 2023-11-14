import { useContext } from "react";
// Material resources
import { Box, Stack, Icon, IconButton, Tooltip } from "@mui/material";
//Custom resources
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";

function AllyActions(params) {
  //Dialog variable context
  const { handleOpen } = useContext(GeneralContext);

  return (
    <>
      <Box>
        <Stack direction="row" spacing={0.1}>
          <Tooltip title="Asociar usuario a aliado">
            <IconButton
              aria-label="Asociar usuario a aliado"
              component="label"
              onClick={() =>
                handleOpen("Asociar usuario a aliado", "../components/Allies/AllyUsers", params)
              }
            >
              <Icon sx={{ color: redFF }}>persona</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
} 

export default AllyActions;
