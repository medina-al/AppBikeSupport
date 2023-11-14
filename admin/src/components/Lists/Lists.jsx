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
import ListActions from "./ListActions";
import { GeneralContext } from "../../context/GeneralContext";
import "../shared/styles/GeneralStyles.css";
// API services
import { getLists } from "../../services/lists";

function Lists() {
    // Use data from context
    const { handleOpen, refreshInfo, setRefreshInfo } = useContext(GeneralContext);

    //Get assists data for table
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [iconClass, setIconClass] = useState("");
    const [globalValues, setGlobalValues] = useState([]);

    const GetLists = async () => {
        setIconClass("iconRefresh");
        const response = await getLists();
        if (response.success) {
            const lists = [];
            response.data.map(function (list, index) {
                lists.push({
                    id: list.id,
                    global: list.global,
                    firstValue: list.firstValue,
                    secondValue: list.secondValue,
                    thirdValue: list.thirdValue,
                });
            });

            lists.map((list)=>{
                list.lists=[...new Set(lists.map(item => item.global))]
            })

            setGlobalValues([...new Set(lists.map(item => item.global))]);

            setRows(lists);
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
            field: "global",
            headerName: "Lista",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "firstValue",
            headerName: "Valor 1",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "secondValue",
            headerName: "Valor 2",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "thirdValue",
            headerName: "Valor 3",
            minWidth: 200,
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "actions",
            headerName: "Acciones",
            minWidth: 120,
            flex: 1,
            headerClassName: "super-app-theme--header",
            align: "center",
            renderCell: (params) => <ListActions {...{ params }} />,
        },
    ];

    //Show or hide columns based on screen size
    //Mobile columns
    const MOBILE_COLUMNS = {
        id: true,
        global: true,
        firstValue: true,
        secondValue: true,
        thirdValue: true,
    };
    //Desktop columns
    const ALL_COLUMNS = {
        id: true,
        global: true,
        firstValue: true,
        secondValue: true,
        thirdValue: true,
    };

    // Define and show or hide columns based on screen size
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const [columnVisible, setColumnVisible] = useState(ALL_COLUMNS);

    useEffect(() => {
        const newColumns = matches ? ALL_COLUMNS : MOBILE_COLUMNS;
        setColumnVisible(newColumns);
        GetLists();
    }, [refreshInfo]);

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Listas desplegables</Box>
                <Box sx={fullBox}>
                    <Tooltip title="Crear Valor de Lista">
                        <IconButton
                            color="primary"
                            aria-label="Crear Valor de Lista"
                            component="label"
                            onClick={() =>
                                handleOpen("Crear Valor de Lista", "../components/Lists/ListCreate",globalValues)
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
                            onClick={() => GetLists()}
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

export default Lists;
