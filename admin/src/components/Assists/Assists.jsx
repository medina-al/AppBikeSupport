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
import CarImage from "./CarImage";
import CarActions from "./CarActions";
import { GeneralContext } from "../../context/GeneralContext";
import "../shared/styles/GeneralStyles.css";
import { formatDate } from "../../utils/dates";
// API services
import { getAssists } from "../../services/assists";

function Assists() {
    // Use data from context
    const { handleOpen, refreshInfo, setRefreshInfo } = useContext(GeneralContext);

    //Get assists data for table
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [iconClass, setIconClass] = useState("");

    const GetAssists = async () => {
        setIconClass("iconRefresh");
        const response = await getAssists();
        if (response.success) {
            const assists = [];
            response.data.map(function (assist, index) {
                assists.push({
                    id: assist.id,
                    title: assist.title,
                    open_time: formatDate(assist.open_time),
                    user: assist.UserAssist.username,
                    technician: (assist.TechnicianAssist) ? assist.TechnicianAssist.username : '',
                    ally: (assist.Ally) ? assist.Ally.name : '',
                    status: assist.StatusAssist.firstValue
                });
            });
            setRows(assists);
            setTimeout(function () {
                setIconClass("");
                setRefreshInfo(false);
            }, 1000);
        } else {
            alert("Error Get Assists");
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
            field: "open_time",
            headerName: "Fecha de apertura",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "user",
            headerName: "Usuario",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "technician",
            headerName: "Técnico",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center"
        },
        {
            field: "ally",
            headerName: "Aliado",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "status",
            headerName: "State",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center",
            renderCell: (params) => {
                let chipColor = "success";
                if (params.value == 'EN PROCESO') {
                    chipColor = "success";
                }
                if (params.value == 'PENDIENTE ASIGNACIÓN') {
                    chipColor = "info";
                }
                if (params.value == 'CERRADA') {
                    chipColor = "info";
                }
                if (params.value == 'CANCELADA USUARIO' || params.value == 'CANCELADA ALIADO' || params.value == 'CANCELADA ADMINISTRADOR') {
                    chipColor = "error";
                }
                return (
                    <span>
                        <Chip label={params.value} color={chipColor} />
                    </span>
                )
            }
        },
    ];

    //Show or hide columns based on screen size
    //Mobile columns
    const MOBILE_COLUMNS = {
        id: true,
        title: true,
        open_time: true,
        user: true,
        technician: true,
        ally: true,
        status: true,
    };
    //Desktop columns
    const ALL_COLUMNS = {
        id: true,
        title: true,
        open_time: true,
        user: true,
        technician: true,
        ally: true,
        status: true,
    };

    // Define and show or hide columns based on screen size
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [columnVisible, setColumnVisible] = useState(ALL_COLUMNS);

    useEffect(() => {
        const newColumns = matches ? ALL_COLUMNS : MOBILE_COLUMNS;
        setColumnVisible(newColumns);
        GetAssists();
    }, [refreshInfo]);

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Assists</Box>
                <Box sx={fullBox}>
                    <Tooltip title="Create Car">
                        <IconButton
                            color="primary"
                            aria-label="Create Car"
                            component="label"
                            onClick={() =>
                                handleOpen("Create Car", "../components/Cars/CarCreate")
                            }
                        >
                            <Icon sx={bigButtonWhite}>add_circle</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh data">
                        <IconButton
                            color="primary"
                            aria-label="Refresh data"
                            component="label"
                            onClick={() => GetAssists()}
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

export default Assists;
