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
import AllyActions from "./AllyActions";
import { GeneralContext } from "../../context/GeneralContext";
import "../shared/styles/GeneralStyles.css";
// API services
import { getAllies } from "../../services/allies";

function Allies() {
    // Use data from context
    const { handleOpen, refreshInfo, setRefreshInfo } = useContext(GeneralContext);

    //Get allies data for table
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [iconClass, setIconClass] = useState("");

    const GetAllies = async () => {
        setIconClass("iconRefresh");
        const response = await getAllies();
        if (response.success) {
            const allies = [];
            response.data.map(function (ally, index) {
                allies.push({
                    id: ally.id,
                    name: ally.name,
                    description: ally.description,
                    address: ally.address,
                    phone: ally.phone,
                    mobile: ally.mobile,
                    status: ally.status
                });
            });
            setRows(allies);
            setTimeout(function () {
                setIconClass("");
                setRefreshInfo(false);
            }, 1000);
        } else {
            alert("Error Get Allies");
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
            field: "description",
            headerName: "Description",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header"
        },
        {
            field: "address",
            headerName: "Dirección",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "phone",
            headerName: "Teléfono",
            minWidth: 100,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "right"
        },
        {
            field: "mobile",
            headerName: "Celular",
            minWidth: 100,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "right"
        },
        {
            field: "status",
            headerName: "Estado",
            minWidth: 100,
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
            headerName: "Actions",
            minWidth: 120,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center",
            renderCell: (params) => <AllyActions {...{ params }} />,
        },
    ];

    //Show or hide columns based on screen size
    //Mobile columns
    const MOBILE_COLUMNS = {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        mobile: true,
        status: true,
        actions: true,
    };
    //Desktop columns
    const ALL_COLUMNS = {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        mobile: true,
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
        GetAllies();
    }, [refreshInfo]);

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Aliados</Box>
                <Box sx={fullBox}>
                    <Tooltip title="Crear Aliado">
                        <IconButton
                            color="primary"
                            aria-label="Crear Aliado"
                            component="label"
                            onClick={() =>
                                handleOpen("Crear Aliado", "../components/Allies/AllyCreate")
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
                            onClick={() => GetAllies()}
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

export default Allies;
