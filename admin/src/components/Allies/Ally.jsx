import { useState, useEffect, useContext } from "react";
// Material resources
import { Button, Box, Grid, Typography, Icon, IconButton, TextField, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import {
    AddPhotoAlternate,
    Send,
} from "@mui/icons-material/";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// Custom resources
import {
    moduleTitleBox,
    moduleTitle,
    tableGrid,
    bigButtonOrange,
    saveButton
} from "../shared/styles/MUIStyles";
import "../shared/styles/GeneralStyles.css";
import { redFF } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
// API services
import { getAllyByUser, handleAllyImage, editAlly } from "../../services/allies";
//External libraries
import { GoogleMap, Marker } from "@react-google-maps/api";
import dayjs from "dayjs";

function Ally() {
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
    //form
    const [allyId, setAllyId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [latitude, setLatitude] = useState(4.628621);
    const [longitude, setLongitude] = useState(-74.065062);
    const [status, setStatus] = useState("");
    const [images, setImages] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [services, setServices] = useState([]);

    const onMarkerDragEnd = (e) => {
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());
    };

    const GetAlly = async () => {
        const response = await getAllyByUser();
        if (response.success) {
            setAllyId(response.data.Ally.id);
            setName(response.data.Ally.name);
            setDescription(response.data.Ally.description);
            setAddress(response.data.Ally.address);
            setPhone(response.data.Ally.phone);
            setMobile(response.data.Ally.mobile);
            setLatitude(response.data.Ally.latitude);
            setLongitude(response.data.Ally.longitude);
            setStatus(response.data.Ally.status);
            setImages(response.data.Ally.AllyImages);
            setSchedules(response.data.Ally.AllySchedules);
            setServices(response.data.Ally.AllyServices);
        } else {
            alert("Error Get ally");
            console.log(response);
        }
    };
    useEffect(() => {
        GetAlly()
    }, []);

    const uploadImage = async (e) => {
        const image = e.target.files[0];
        const response = await handleAllyImage(allyId, 0, image);
        if (response.success) {
            setImages((prevImages) => [...prevImages, response.data]);
        } else {
            console.log("Error al subir la imagen:", response);
        }
    };

    const deleteImage = async (imageId) => {
        const response = await handleAllyImage(allyId, imageId);
        if (response.success) {
            setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
        } else {
            console.log("Error al subir la imagen:", response);
        }
    }

    const handleScheduleChange = (index, field, value) => {
        const formattedDate = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        const updatedSchedules = [...schedules];
        updatedSchedules[index][field] = formattedDate;
        setSchedules(updatedSchedules);
    };

    const [newService, setNewService] = useState({ service: "", description: "" });

    const handleServiceChange = (index, field, value) => {
        if (index !== null) {
            const updatedServices = [...services];
            updatedServices[index][field] = value;
            setServices(updatedServices);
        } else {
            setNewService((prev) => ({ ...prev, [field]: value }));
        }
    };

    const addService = () => {
        if (newService.service.trim() !== "" && newService.description.trim() !== "") {
            setServices((prevServices) => [...prevServices, newService]);
            setNewService({ service: "", description: "" });
        } else {
            alert("Por favor, complete todos los campos del nuevo servicio.");
        }
    };

    async function EditAlly() {

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
            status: status,
            schedules: schedules,
            services: services
        }
        const response = await editAlly(allyId, body);
        if (response.success) {
            setMessage("Aliado actualizado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            setMessage("Error actualizando aliado: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    return (
        <Box>
            <Box sx={moduleTitleBox}>
                <Box sx={moduleTitle}>Mi tienda</Box>
            </Box>
            <Box sx={[tableGrid, { padding: 5 }]}>
                <Grid container spacing={5}>
                    <Grid item xs={12} container alignItems="center">
                        <Typography variant="h4" color={redFF}>Datos básicos</Typography>
                    </Grid>
                    <Grid item xs={4} container alignItems="center">
                        <TextField
                            label="Nombre*"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} container alignItems="center">
                        <TextField
                            label="Dirección*"
                            variant="outlined"
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} container alignItems="center">
                        <TextField
                            label="Télefono fijo"
                            variant="outlined"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={4} container alignItems="center">
                        <TextField
                            label="Celular*"
                            variant="outlined"
                            fullWidth
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={4} container alignItems="center">
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
                    <Grid item xs={4} container alignItems="center">
                        <InputLabel id="status_label">Estado</InputLabel>
                        <Select
                            labelId="status_label"
                            value={status}
                            label="Estado*"
                            onChange={(e) => {setStatus(e.target.value);}}
                            sx={{ width: "100%" }}
                        >
                            <MenuItem value={"ACTIVO"}>Activo</MenuItem>
                            <MenuItem value={"INACTIVO"}>Inactivo</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Typography variant="h4" color={redFF}>Mapa e imágenes</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={"center"}>
                        <Typography variant="body" color={redFF}>Puedes mover el marcador en el mapa</Typography>
                        <GoogleMap
                            center={{ lat: latitude, lng: longitude }}
                            zoom={18}
                            mapContainerStyle={{ height: "90%", width: "100%" }}
                        >
                            <Marker
                                position={{ lat: latitude, lng: longitude }}
                                draggable={true}
                                onDragEnd={(e) => onMarkerDragEnd(e)}
                            />
                        </GoogleMap>
                    </Grid>
                    <Grid item xs={6} textAlign={"center"}>
                        <Grid container spacing={1}>
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Typography variant="h4" color={redFF}>Horarios y servicios</Typography>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={6} textAlign={"center"}>
                            {schedules && schedules?.length > 0 &&
                                schedules.map((schedule, index) => (
                                    <Grid key={"schedule_" + index} container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="body" color={redFF}>
                                                {schedule.ListsMaster.secondValue}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TimePicker
                                                label="Hora de apertura"
                                                value={dayjs(schedule.open_time)}
                                                onChange={(newValue) =>
                                                    handleScheduleChange(index, "open_time", newValue)
                                                }
                                                renderInput={(props) => <TextField {...props} />}
                                            />
                                            <br /><br />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TimePicker
                                                label="Hora de cierre"
                                                value={dayjs(schedule.close_time)}
                                                onChange={(newValue) =>
                                                    handleScheduleChange(index, "close_time", newValue)
                                                }
                                                renderInput={(props) => <TextField {...props} />}
                                            />
                                            <br /><br />
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </LocalizationProvider>
                    <Grid item xs={6} textAlign={"center"}>
                        {services && services?.length > 0 &&
                            services.map((service, index) => (
                                <Grid key={"service_" + index} container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Servicio*"
                                            variant="outlined"
                                            fullWidth
                                            value={service.service}
                                            onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Descripción*"
                                            variant="outlined"
                                            fullWidth
                                            value={service.description}
                                            onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                                            multiline
                                            maxRows={4}
                                        />
                                        <br /><br />
                                    </Grid>
                                </Grid>
                            ))
                        }
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body" color={redFF}>
                                    Añadir un servicio nuevo
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="Nuevo servicio*"
                                    variant="outlined"
                                    fullWidth
                                    value={newService.service}
                                    onChange={(e) => handleServiceChange(null, "service", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="Descripción*"
                                    variant="outlined"
                                    fullWidth
                                    value={newService.description}
                                    onChange={(e) => handleServiceChange(null, "description", e.target.value)}
                                    multiline
                                    maxRows={4}
                                />
                                <br /><br />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton
                                    color={"primary"}
                                    aria-label="Añadir servicio"
                                    component="label"
                                    onClick={() => { addService() }}
                                >
                                    <Icon sx={bigButtonOrange}>add</Icon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} textAlign={"center"}>
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<Send />}
                            sx={saveButton}
                            onClick={EditAlly}
                        >
                            ACTUALIZAR MI TIENDA
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Ally;
