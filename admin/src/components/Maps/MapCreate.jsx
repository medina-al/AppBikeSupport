import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel } from "@mui/material";
import { Send } from "@mui/icons-material/";
// Custom resources
import { saveButton } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { createMap } from "../../services/maps";

function MapCreate({ params }) {
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
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [icon, setIcon] = useState("");
    const [markerIcon, setMarkerIcon] = useState("");

    //Handle form submit
    async function createMapService() {

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

        const body = {
            name: name,
            type: type,
            icon: icon,
            marker_icon: markerIcon,
        }
        const response = await createMap(body);
        if (response.success) {
            setMessage("Mapa creado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error creando mapa: " + response.response.data.title);
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
                            onClick={createMapService}
                        >
                            CREAR MAPA
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default MapCreate;
