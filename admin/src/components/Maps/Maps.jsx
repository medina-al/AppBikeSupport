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
import MapActions from "./MapActions";
import { GeneralContext } from "../../context/GeneralContext";
import "../shared/styles/GeneralStyles.css";
// API services
import { getMaps } from "../../services/maps";

function Maps() {
    // Use data from context
    const { handleOpen, refreshInfo, setRefreshInfo } = useContext(GeneralContext);

    //Get assists data for table
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [iconClass, setIconClass] = useState("");

    const GetMaps = async () => {
        setIconClass("iconRefresh");
        const response = await getMaps();
        if (response.success) {
            const maps = [];
            response.data.map(function (map, index) {
                maps.push({
                    id: map.id,
                    name: map.name,
                    type: map.type,
                    icon: map.icon,
                    markerIcon: map.marker_icon,
                    mapPoints: map.MapPoints,
                    status: map.status
                });
            });
            setRows(maps);
            setTimeout(function () {
                setIconClass("");
                setRefreshInfo(false);
            }, 1000);
        } else {
            alert("Error Get Maps");
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
            field: "name",
            headerName: "Nombre",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "type",
            headerName: "Tipo",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "icon",
            headerName: "Ícono",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "markerIcon",
            headerName: "Ícono de marcadores",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
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
                    params.value == 'ACTIVO' ?
                        <Chip label="Activo" color="success" /> :
                        <Chip label="Inactivo" color="secondary" />
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
            renderCell: (params) => <MapActions {...{ params }} />,
        },
    ];

    //Show or hide columns based on screen size
    //Mobile columns
    const MOBILE_COLUMNS = {
        id: true,
        name: true,
        type: true,
        icon: true,
        markerIcon: true,
        status: true,
        actions: true,
    };
    //Desktop columns
    const ALL_COLUMNS = {
        id: true,
        name: true,
        type: true,
        icon: true,
        markerIcon: true,
        status: true,
        actions: true,
    };

    // Define and show or hide columns based on screen size
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [columnVisible, setColumnVisible] = useState(ALL_COLUMNS);

    useEffect(() => {
        const newColumns = matches ? ALL_COLUMNS : MOBILE_COLUMNS;
        setColumnVisible(newColumns);
        GetMaps();
    }, [refreshInfo]);

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Mapas</Box>
                <Box sx={fullBox}>
                    <Tooltip title="Crear Mapa">
                        <IconButton
                            color="primary"
                            aria-label="Crear Mapa"
                            component="label"
                            onClick={() =>
                                handleOpen("Crear Mapa", "../components/Maps/MapCreate")
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
                            onClick={() => GetMaps()}
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

export default Maps;
