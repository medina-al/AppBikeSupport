import React, { useState, useContext, useEffect } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel } from "@mui/material";
import { Send } from "@mui/icons-material/";
// Custom resources
import { saveButton } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { associateUser } from "../../services/allies";
import { getUsers } from "../../services/user";

function AllyUsers({ params }) {
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
    const [allyId, setAllyId] = useState(params.params.row.id);
    const [userId, setUserId] = useState('');
    const [userType, setUserType] = useState('');
    const [users, setUsers] = useState();

    const GetUsers = async () => {
        const response = await getUsers();
        if (response.success) {
            setUsers(response.data)
        } else {
            setMessage("Error al consultar los usuarios obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }
    }
    //Handle form submit
    async function AssociateUser() {

        if (userId == undefined || userId == '') {
            setMessage("El usuario a asociar es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (userType == undefined || userType == '') {
            setMessage("El tipo de usuario es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        const response = await associateUser(allyId, userId, userType);
        if (response.success) {
            setMessage("Aliado actualizado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error actualizndo aliado: " + response.response.data.title);
            setMessageType("error");
            setOpenMessage(true);
            setLoadingImg(false);
            console.log(response.response.data.data);
        }
    }

    useEffect(() => {
        GetUsers();
    }, []);

    return (
        <>
            <Grid container spacing={5}>
                <Grid item xs={6} container alignItems="center">
                    <InputLabel id="user_id">Usuario*</InputLabel>
                    <Select
                        labelId="user_id"
                        value={userId}
                        label="Usuario*"
                        onChange={(e) => setUserId(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        {users && users.length > 0 &&
                            users.map((user, index) => (
                                <MenuItem key={"user_" + index} value={user.id}>{user.username}</MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <InputLabel id="user_type">Tipo de usuario*</InputLabel>
                    <Select
                        labelId="user_type"
                        value={userType}
                        label="Tipo de usuario*"
                        onChange={(e) => setUserType(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value={'ALIADO'}>ALIADO</MenuItem>
                        <MenuItem value={'TÉCNICO'}>TÉCNICO</MenuItem>
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
                            onClick={AssociateUser}
                        >
                            ASOCIAR USUARIO
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default AllyUsers;
