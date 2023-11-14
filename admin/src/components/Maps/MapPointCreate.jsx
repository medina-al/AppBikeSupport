import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Typography } from "@mui/material";
import { Send } from "@mui/icons-material/";
// Custom resources
import { saveButton } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
import { redFF } from "../shared/styles/MUIStyles";
//API services
import { createPoint } from "../../services/maps";
//External libraries
import { GoogleMap, Marker } from "@react-google-maps/api";

function MapPointCreate({ params }) {
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
    const [latitude, setLatitude] = useState(4.628621);
    const [longitude, setLongitude] = useState(-74.065062);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");

    const onMarkerDragEnd = (e) => {
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());
    };

    //Handle form submit
    async function createMapPoint() {

        if (title == undefined || title == '') {
            setMessage("El título es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        const body = {
            map_id: mapId,
            latitude: latitude,
            longitude: longitude,
            title: title,
            description: description,
            schedule: schedule,
        }
        const response = await createPoint(body);
        if (response.success) {
            setMessage("Punto creado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error creando punto: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }
    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={6}>
                    <Typography variant="body" color={redFF}>Puedes mover el marcador en el mapa</Typography>
                    <GoogleMap
                        center={{ lat: latitude, lng: longitude }}
                        zoom={18}
                        mapContainerStyle={{ height: "300px", width: "100%" }}
                    >
                        <Marker
                            position={{ lat: latitude, lng: longitude }}
                            draggable={true}
                            onDragEnd={(e) => onMarkerDragEnd(e)}
                        />
                    </GoogleMap>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <br /><br />
                    <TextField
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                    <br /><br />
                    <TextField
                        label="Horario"
                        variant="outlined"
                        fullWidth
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
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
                            onClick={createMapPoint}
                        >
                            CREAR PUNTO
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default MapPointCreate;
