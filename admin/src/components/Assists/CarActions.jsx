import { useContext } from "react";
// Material resources
import { Box, Stack, Icon, IconButton, Tooltip } from "@mui/material";
//Custom resources
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";

function CarActions(params) {
  //Dialog variable context
  const { handleOpen } = useContext(GeneralContext);

  return (
    <>
      <Box>
        <Stack direction="row" spacing={0.1}>
          <Tooltip title="Edit Car">
            <IconButton
              aria-label="Edit Car"
              component="label"
              onClick={() =>
                handleOpen("Edit Car", "../components/Cars/CarEdit", params)
              }
            >
              <Icon sx={{ color: redFF }}>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Car State">
            <IconButton
              aria-label="Change Car State"
              component="label"
              onClick={() =>
                handleOpen("Change Car State", "../components/Cars/CarState", params)
              }
            >
              <Icon sx={{ color: redFF }}>toggle_off</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
}

export default CarActions;
