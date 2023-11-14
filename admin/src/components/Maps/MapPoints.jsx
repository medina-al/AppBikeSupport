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
import { editPoints } from "../../services/maps";
//External libraries
import { GoogleMap, Marker } from "@react-google-maps/api";

function MapPoints({ params }) {
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
    const [mapPoints, setMapPoints] = useState(params.params.row.mapPoints);

    const onMarkerDragEnd = (index, e) => {
        const updatedMapPoints = [...mapPoints];
        updatedMapPoints[index] = {
            ...updatedMapPoints[index],
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
        };
        setMapPoints(updatedMapPoints);
    };

    const handleInputChange = (index, key, value) => {
        const updatedMapPoints = [...mapPoints];
        updatedMapPoints[index] = {
            ...updatedMapPoints[index],
            [key]: value,
        };
        setMapPoints(updatedMapPoints);
    };

    //Handle form submit
    async function editMapPoints() {
        setLoadingImg(true);
        const response = await editPoints(mapId, mapPoints);
        if (response.success) {
            setMessage("Puntos actualizados exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error actualizando puntos: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    return (
        <>
            <Grid container spacing={5}>
                {mapPoints && mapPoints.length > 0 &&
                    mapPoints.map((point, index) => {
                        return (
                            <React.Fragment key={index}>
                                {(index > 0) &&
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                }
                                <Grid item xs={6}>
                                    <Typography variant="body" color={redFF}>Puedes mover el marcador en el mapa</Typography>
                                    <GoogleMap
                                        center={{ lat: point.latitude, lng: point.longitude }}
                                        zoom={18}
                                        mapContainerStyle={{ height: "300px", width: "100%" }}
                                    >
                                        <Marker
                                            position={{ lat: point.latitude, lng: point.longitude }}
                                            draggable={true}
                                            onDragEnd={(e) => onMarkerDragEnd(index, e)}
                                        />
                                    </GoogleMap>
                                </Grid>
                                <Grid item xs={6} container alignItems="center">
                                    <TextField
                                        label="Nombre"
                                        variant="outlined"
                                        fullWidth
                                        value={point.title}
                                        onChange={(e) => handleInputChange(index, "title", e.target.value)}
                                    />
                                    <br /><br />
                                    <TextField
                                        label="Descripción"
                                        variant="outlined"
                                        fullWidth
                                        value={point.description}
                                        onChange={(e) => handleInputChange(index, "description", e.target.value)}
                                        multiline
                                        maxRows={4}
                                    />
                                    <br /><br />
                                    <TextField
                                        label="Horario"
                                        variant="outlined"
                                        fullWidth
                                        value={point.schedule}
                                        onChange={(e) => handleInputChange(index, "schedule", e.target.value)}
                                        multiline
                                        maxRows={4}
                                    />
                                </Grid>
                            </React.Fragment>
                        )
                    })
                }
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
                            onClick={editMapPoints}
                        >
                            EDITAR PUNTOS
                        </Button>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

export default MapPoints;
