import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel, Box, IconButton, Icon } from "@mui/material";
import { AddPhotoAlternate, Send } from "@mui/icons-material/";
// Custom resources
import { saveButton, redFF, bigButtonOrange } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { handleRecImage } from "../../services/recommendations";

function RecommendationImageEdit({ params }) {
    console.log(params.params.row);
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
    const [images, setImages] = useState(params.params.row.media);

    const uploadImage = async (e) => {
        const image = e.target.files[0];
        const response = await handleRecImage(recId, 0, image);
        if (response.success) {
            setImages((prevImages) => [...prevImages, response.data]);
        } else {
            console.log("Error al subir la imagen:", response);
        }
    };

    const deleteImage = async (imageId) => {
        const response = await handleRecImage(recId, imageId);
        if (response.success) {
            setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
        } else {
            console.log("Error al subir la imagen:", response);
        }
    }

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={4} textAlign={"center"} alignItems="center">
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
                            <img src={import.meta.env.VITE_API + '/' + image.url}
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
                                onClick={() => { deleteImage(image.id) }}
                            >
                                <Icon sx={bigButtonOrange}>delete</Icon>
                            </IconButton>
                        </Grid>
                    ))
                }
            </Grid >
        </>
    );
}

export default RecommendationImageEdit;
