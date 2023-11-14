import { useContext } from "react";
// Material resources
import { Box, Stack, Icon, IconButton, Tooltip } from "@mui/material";
//Custom resources
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";

function RecommendationActions(params) {
  //Dialog variable context
  const { handleOpen } = useContext(GeneralContext);
  return (
    <>
      <Box>
        <Stack direction="row" spacing={0.1}>
          <Tooltip title="Editar Recomendación">
            <IconButton
              aria-label="Editar Recomendación"
              component="label"
              onClick={() =>
                handleOpen("Editar Recomendación", "../components/Recommendations/RecommendationEdit", params)
              }
            >
              <Icon sx={{ color: redFF }}>edit</Icon>
            </IconButton>
          </Tooltip>
          {params.params.row.type=='IMAGE' &&
            <Tooltip title="Editar Imágenes Recomendación">
              <IconButton
                aria-label="Editar Imágenes Recomendación"
                component="label"
                onClick={() =>
                  handleOpen("Editar Imágenes Recomendación", "../components/Recommendations/RecommendationImageEdit", params)
                }
              >
                <Icon sx={{ color: redFF }}>collections</Icon>
              </IconButton>
            </Tooltip>
          }
        </Stack>
      </Box>
    </>
  );
}

export default RecommendationActions;
