import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel } from "@mui/material";
import { Send } from "@mui/icons-material/";
// Custom resources
import { saveButton } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { editMap } from "../../services/maps";

function MapEdit({ params }) {
    //Loading Image
    const [loadingImg, setLoadingImg] = useState(false);

    //General variable context
    const {
        handleClose,
        setMessage,
        setMessageType,
        setOpenMessage,
        setRefreshInfo,
    } = useContext(GeneralContext);

    //Set map values
    const [mapId, setMapId] = useState(params.params.row.id);
    const [name, setName] = useState(params.params.row.name);
    const [type, setType] = useState(params.params.row.type);
    const [icon, setIcon] = useState(params.params.row.icon);
    const [markerIcon, setMarkerIcon] = useState(params.params.row.markerIcon);
    const [status, setStatus] = useState(params.params.row.status);

    //Handle form submit
    async function editMapService() {

        if (name == undefined || name == '') {
            setMessage("El nombre es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (type == undefined || type == '') {
            setMessage("El tipo es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (icon == undefined || icon == '') {
            setMessage("El ícono es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (markerIcon == undefined || markerIcon == '') {
            setMessage("El ícono de los marcadores es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (status == undefined || status == '') {
            setMessage("El estado es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        const body = {
            name: name,
            type: type,
            icon: icon,
            marker_icon: markerIcon,
            status: status,
        }
        const response = await editMap(mapId,body);
        if (response.success) {
            setMessage("Mapa actualizado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error actualizndo mapa: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Nombre*"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <InputLabel id="tipo_label">Tipo de mapa</InputLabel>
                    <Select
                        labelId="tipo_label"
                        value={type}
                        label="Tipo*"
                        onChange={(e) => setType(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={"puntos"}>Puntos</MenuItem>
                        <MenuItem value={"linea"}>Línea</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Ícono*"
                        variant="outlined"
                        fullWidth
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Ícono de los marcadores*"
                        variant="outlined"
                        fullWidth
                        value={markerIcon}
                        onChange={(e) => setMarkerIcon(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                </Grid>
                <Grid item xs={12} container alignItems="center">
                    <InputLabel id="status_label">Estado</InputLabel>
                    <Select
                        labelId="status_label"
                        value={status}
                        label="Estado*"
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={"ACTIVO"}>Activo</MenuItem>
                        <MenuItem value={"INACTIVO"}>Inactivo</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                    {loadingImg && <Loading />}
                    <br />
                    {!loadingImg && (
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<Send />}
                            fullWidth
                            sx={saveButton}
                            onClick={editMapService}
                        >
                            EDITAR MAPA
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default MapEdit;
