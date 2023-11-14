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
import { createAlly } from "../../services/allies";
//External libraries
import { GoogleMap, Marker } from "@react-google-maps/api";

function AllyCreate({ params }) {
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
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [latitude, setLatitude] = useState(4.628621);
    const [longitude, setLongitude] = useState(-74.065062);

    const onMarkerDragEnd = (e) => {
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());
    };

    //Handle form submit
    async function CreateAlly() {

        if (name == undefined || name == '') {
            setMessage("El nombre es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }
        if (address == undefined || address == '') {
            setMessage("La dirección es obligatoria");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }
        if (mobile == undefined || mobile == '') {
            setMessage("El celular es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }
        if (description == undefined || description == '') {
            setMessage("La descripción es obligatoria");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        const body = {
            name: name,
            description: description,
            address: address,
            phone: phone,
            mobile: mobile,
            latitude: latitude,
            longitude: longitude,
        }
        const response = await createAlly(body);
        if (response.success) {
            setMessage("Aliado creado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error creando aliado: " + response.response.data.title);
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
                    <TextField
                        label="Dirección*"
                        variant="outlined"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Télefono fijo"
                        variant="outlined"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="number"
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Celular*"
                        variant="outlined"
                        fullWidth
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} container alignItems="center">
                    <TextField
                        label="Descripción*"
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                </Grid>
                <Grid item xs={12} container alignItems="center">
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
                            onClick={CreateAlly}
                        >
                            CREAR ALIADO
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default AllyCreate;
