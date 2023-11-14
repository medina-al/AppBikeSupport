import React, { useState, useContext } from "react";
// Material resources
import { Button, Grid, TextField, Divider, Select, MenuItem, InputLabel } from "@mui/material";
import { Send } from "@mui/icons-material/";
// Custom resources
import { saveButton } from "../shared/styles/MUIStyles";
import { GeneralContext } from "../../context/GeneralContext";
import Loading from "../shared/Loading";
//API services
import { editList } from "../../services/lists";

function ListEdit({ params }) {
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
    const [listId, setListId] = useState(params.params.row.id);
    const [global, setGlobal] = useState(params.params.row.global);
    const [firstValue, setFirstValue] = useState(params.params.row.firstValue);
    const [secondValue, setSecondValue] = useState(params.params.row.secondValue?params.params.row.secondValue:'');
    const [thirdValue, setThirdValue] = useState(params.params.row.thirdValue?params.params.row.thirdValue:'');
    const [lists, setLists] = useState(params.params.row.lists);

    //Handle form submit
    async function EditList() {

        if (global == undefined || global == '') {
            setMessage("La lista es obligatoria");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        if (firstValue == undefined || firstValue == '') {
            setMessage("Al menos el primer valor es obligatorio");
            setMessageType("warning");
            setOpenMessage(true);
            return;
        }

        const body = {
            global: global,
            firstValue: firstValue,
            secondValue: secondValue,
            thirdValue: thirdValue,
        }
        const response = await editList(listId,body);
        if (response.success) {
            setMessage("Valor de lista actualizado exitosamente");
            setMessageType("success");
            setOpenMessage(true);
            setLoadingImg(false);
            setRefreshInfo(true);
            handleClose();
        } else {
            setMessage("Error actualizando valor de lista: " + response.response.data.title);
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
                    <InputLabel id="tipo_label">Lista</InputLabel>
                    <Select
                        labelId="tipo_label"
                        value={global}
                        label="Lista*"
                        onChange={(e) => setGlobal(e.target.value)}
                        sx={{ width: "100%" }}
                    >
                        {
                            lists.map((globalList,index)=>(
                                <MenuItem key={"global_"+index} value={globalList}>{globalList}</MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Valor 1*"
                        variant="outlined"
                        fullWidth
                        value={firstValue}
                        onChange={(e) => setFirstValue(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Valor 2"
                        variant="outlined"
                        fullWidth
                        value={secondValue}
                        onChange={(e) => setSecondValue(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <TextField
                        label="Valor 3"
                        variant="outlined"
                        fullWidth
                        value={thirdValue}
                        onChange={(e) => setThirdValue(e.target.value)}
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
                            onClick={EditList}
                        >
                            ACTUALIZAR VALOR DE LISTA
                        </Button>
                    )}
                </Grid>
            </Grid >
        </>
    );
}

export default ListEdit;
