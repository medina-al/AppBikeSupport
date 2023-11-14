import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel, Box, IconButton, Icon } from "@mui/material";
import { AddPhotoAlternate, Send } from "@mui/icons-material/";
// Custom resources
import { saveButton, redFF, bigButtonOrange } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { createRecommendation } from "../../services/recommendations";

function RecommendationCreate({ params }) {
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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("VIDEO");
    const [video, setVideo] = useState("");
    const [images, setImages] = useState([]);

    //Handle form submit
    async function CreateRecommendations() {

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

        if (type == undefined || type == '') {
            setMessage("El tipo de recomendación es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (type == "IMAGE") {
            if (images.length == 0) {
                setMessage("Debes subir al menos una imagen");
                setMessageType("warning");
                setOpenMessage(true);
                return;
            }
        }else{
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
        }
        if (images.length > 0) {
            body.recommendation = images;
        }
        const response = await createRecommendation(body);
        if (response.success) {
            setMessage("Recomendación creada exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error creando recomendación: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    const uploadImage = (e) => {
        const newImages = Array.from(e.target.files).map((file) =>
            URL.createObjectURL(file)
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const deleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Título*"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <InputLabel id="tipo_label">Tipo de recomendación</InputLabel>
                    <Select
                        labelId="tipo_label"
                        value={type}
                        label="Tipo*"
                        onChange={(e) => { setType(e.target.value); }}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={"IMAGE"}>Imágenes</MenuItem>
                        <MenuItem value={"VIDEO"}>Video Youtube</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} container alignItems="center">
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
                {(type == 'IMAGE') ? (
                    <Grid item xs={12} container alignItems="center">
                        <Grid container spacing={5}>
                            <Grid item xs={4} alignItems="center">
                                <Box
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "10px",
                                        height: "100%",
                                        border: `5px solid  ${redFF.color}`,
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        className="hidden"
                                        id="ally_image"
                                        type="file"
                                        multiple
                                        onChange={(e) => uploadImage(e)}
                                    />
                                    <label htmlFor="ally_image">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<AddPhotoAlternate />}
                                            fullWidth
                                        >
                                            Añadir imagen
                                        </Button>
                                    </label>
                                </Box>
                            </Grid>
                            {images && images?.length > 0 &&
                                images.map((image, index) => (
                                    <Grid key={"image_" + index} item xs={4} textAlign={"center"}>
                                        <img src={image}
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                borderRadius: "20px",
                                                border: `1px solid black`,
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                aspectRatio: 1,
                                                margin: "0 auto"
                                            }} />
                                        <IconButton
                                            color={"primary"}
                                            aria-label="Eliminar imagen"
                                            component="label"
                                            onClick={() => { deleteImage(index) }}
                                        >
                                            <Icon sx={bigButtonOrange}>delete</Icon>
                                        </IconButton>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                ) : (
                    <Grid item xs={6} container alignItems="center">
                        <TextField
                            label="ID Video Youtube*"
                            variant="outlined"
                            fullWidth
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        />
                    </Grid>
                )}
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
                            onClick={CreateRecommendations}
                        >
                            CREAR RECOMENDACIÓN
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default RecommendationCreate;
