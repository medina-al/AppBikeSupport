import { useState, useEffect, useContext } from "react";
// Material resources
import { Box, Icon, IconButton, useMediaQuery, Tooltip, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
// Custom resources
import {
    moduleTitleBox,
    moduleTitle,
    fullBox,
    bigButtonWhite,
    tableContainer,
    tableGrid,
} from "../shared/styles/MUIStyles";
import RecommendationActions from "./RecommendationActions";
import { GeneralContext } from "../../context/GeneralContext";
import "../shared/styles/GeneralStyles.css";
// API services
import { getRecommendations } from "../../services/recommendations";

function Recommendations() {
    // Use data from context
    const { handleOpen, refreshInfo, setRefreshInfo } = useContext(GeneralContext);

    //Get assists data for table
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [iconClass, setIconClass] = useState("");

    const GetRecommendations = async () => {
        setIconClass("iconRefresh");
        const response = await getRecommendations();
        if (response.success) {
            const recs = [];
            response.data.map(function (rec, index) {
                recs.push({
                    id: rec.id,
                    title: rec.title,
                    description: rec.description,
                    type: rec.type,
                    status: rec.status,
                    media: rec.RecommendationMedias,
                });
            });
            setRows(recs);
            setTimeout(function () {
                setIconClass("");
                setRefreshInfo(false);
            }, 1000);
        } else {
            alert("Error Get Recommendations");
            console.log(response);
        }
    };

    //Define columns
    const columns = [
        {
            field: "id",
            headerName: "ID",
            minWidth: 100,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "title",
            headerName: "Título",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "status",
            headerName: "Estado",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center",
            renderCell: (params) => {
                return (
                    params.value == 'ACTIVA' ?
                        <Chip label="Activa" color="success" /> :
                        <Chip label="Inactiva" color="secondary" />
                )
            }
        },
        {
            field: "actions",
            headerName: "Acciones",
            minWidth: 120,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center",
            renderCell: (params) => <RecommendationActions {...{ params }} />,
        },
    ];

    //Show or hide columns based on screen size
    //Mobile columns
    const MOBILE_COLUMNS = {
        id: true,
        title: true,
        description: true,
        status: true,
    };
    //Desktop columns
    const ALL_COLUMNS = {
        id: true,
        title: true,
        description: true,
        status: true,
    };

    // Define and show or hide columns based on screen size
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [columnVisible, setColumnVisible] = useState(ALL_COLUMNS);

    useEffect(() => {
        const newColumns = matches ? ALL_COLUMNS : MOBILE_COLUMNS;
        setColumnVisible(newColumns);
        GetRecommendations();
    }, [refreshInfo]);

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Recomendaciones</Box>
                <Box sx={fullBox}>
                    <Tooltip title="Crear Recomendación">
                        <IconButton
                            color="primary"
                            aria-label="Crear Recomendación"
                            component="label"
                            onClick={() =>
                                handleOpen("Crear Recomendación", "../components/Recommendations/RecommendationCreate")
                            }
                        >
                            <Icon sx={bigButtonWhite}>add_circle</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Actualizar">
                        <IconButton
                            color="primary"
                            aria-label="Actualizar"
                            component="label"
                            onClick={() => GetRecommendations()}
                        >
                            <Icon sx={bigButtonWhite} className={iconClass}>
                                autorenew
                            </Icon>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={tableContainer} height="600px">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 50]}
                    columnVisibilityModel={columnVisible}
                    onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisible(newModel)
                    }
                    sx={tableGrid}
                />
            </Box>
        </Box>
    );
}

export default Recommendations;
