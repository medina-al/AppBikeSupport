import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel, Box, IconButton, Icon } from "@mui/material";
import { AddPhotoAlternate, Send } from "@mui/icons-material/";
// Custom resources
import { saveButton, redFF, bigButtonOrange } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { editRecommendation } from "../../services/recommendations";

function RecommendationEdit({ params }) {
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
    const [recId, setRecId] = useState(params.params.row.id);
    const [title, setTitle] = useState(params.params.row.title);
    const [description, setDescription] = useState(params.params.row.description);
    const [type, setType] = useState(params.params.row.type);
    const [status, setStatus] = useState(params.params.row.status);
    const [video, setVideo] = useState(params.params.row.media[0].url);

    //Handle form submit
    async function EditRecommendation() {

        if (title == undefined || title == '') {
            setMessage("El título es obligatorio");
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

        if (type == "VIDEO") {
            if (video == undefined || video == '') {
                setMessage("El ID del video es obligatorio");
                setMessageType("warning");
                setOpenMessage(true);
                return;
            }
        }

        const body = {
            title: title,
            type: type,
            description: description,
            video: video,
            status: status,
        }

        const response = await editRecommendation(recId, body);
        if (response.success) {
            setMessage("Recomendación actualizada exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error actualizando recomendación: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={12} alignItems="center">
                    <TextField
                        label="Título*"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} alignItems="center">
                    <TextField
                        label="Descripción*"
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        maxRows={15}
                    />
                </Grid>
                {(type == 'VIDEO' &&
                    <Grid item xs={12} container alignItems="center">
                        <TextField
                            label="ID Video Youtube*"
                            variant="outlined"
                            fullWidth
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        />
                    </Grid>
                )}
                <Grid item xs={12} container alignItems="center">
                    <InputLabel id="status_label">Estado</InputLabel>
                    <Select
                        labelId="status_label"
                        value={status}
                        label="Estado*"
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={"ACTIVA"}>Activa</MenuItem>
                        <MenuItem value={"INACTIVA"}>Inactiva</MenuItem>
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
                            onClick={EditRecommendation}
                        >
                            EDITAR RECOMENDACIÓN
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default RecommendationEdit;
