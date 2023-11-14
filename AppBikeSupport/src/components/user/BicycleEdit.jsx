//React and React Native
import { useState, useEffect, useContext  } from "react";
import { StyleSheet, ScrollView, Alert, Image, View, FlatList } from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom components
import StyledTexts from "../../common/StyledTexts";
import StyledInputs from "../../common/StyledInputs";
import StyledButtons from "../../common/StyledButtons";
import StyledIconButtons from "../../common/StyledIconButtons";
import GeneralContainer from "../../common/GeneralContainer";
import { AuthContext } from "../../contexts/AuthContext";
//Services
import { editBicycle } from "../../services/bicycles";
import { getLists } from "../../services/listsMaster";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Custom styles
import theme from "../../common/styles/theme";
const styles = StyleSheet.create({
    input: {
        width: "90%"
    },
    title: {
        marginBottom: 15
    },
    scrollContent: {
        padding: 10,
        alignContent: "center",
        alignItems: "center"
    },
    row: {
        flex: 1,
        flexDirection: "row"
    },
    image: {
        width: 80,
        height: 80,
        margin: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black'
    },
    picker: {
        backgroundColor: theme.colors.whiteTransparent50,
        borderRadius: 30,
        height: 38,
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
});

const BicycleEdit = () => {
    const bike = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);
    const [materials, setMaterials] = useState();
    const [brakeTypes, setBrakeTypes] = useState();
    const [bikeTypes, setBikeTypes] = useState();

    //Service function
    const getListsServices = async () => {
        const responseMaterials = await getLists("MATERIAL_BICICLETA");
        if (responseMaterials.success) {
            setMaterials(responseMaterials.data);
        }
        const responseBrakeTypes = await getLists("TIPO_FRENO");
        if (responseBrakeTypes.success) {
            setBrakeTypes(responseBrakeTypes.data);
        }
        const responseBikeTypes = await getLists("TIPO_BICICLETA");
        if (responseBikeTypes.success) {
            setBikeTypes(responseBikeTypes.data);
        }
    }

    useEffect(() => {
        getListsServices();
    }, []);
    //Form values
    const [images, setImages] = useState(bike.state.BicycleImages.map((image)=>(apiBaseUrl + image.url)));
    const [bikeId, setBikeId] = useState(bike.state.id);
    const [brand, setBrand] = useState(bike.state.brand);
    const [model, setModel] = useState(bike.state.model.toString());
    const [line, setLine] = useState(bike.state.line);
    const [description, setDescription] = useState(bike.state.description);
    const [wheelSize, setWheelSize] = useState(bike.state.wheel_size);
    const [wheels, setWheels] = useState(bike.state.wheels);
    const [frontGroupset, setFrontGroupset] = useState(bike.state.front_groupset);
    const [backGroupset, setBackGroupset] = useState(bike.state.back_groupset);
    const [brakes, setBrakes] = useState(bike.state.brakes);
    const [userId, setUserId] = useState(userInfo.id);
    const [materialId, setMaterialId] = useState(bike.state.material_id);
    const [typeId, setTypeId] = useState(bike.state.type_id);
    const [brakesTypeId, setBrakesTypeId] = useState(bike.state.brakes_type_id);
    const [publicBike, setPublicBike] = useState((bike.state.public == true) ? 1 : 0);
    //Error variables
    const [errorImages, setErrorImages] = useState();
    const [errorBrand, setErrorBrand] = useState();
    const [errorModel, setErrorModel] = useState();
    const [errorLine, setErrorLine] = useState();
    const [errorDescription, setErrorDescription] = useState();
    const [errorMaterialId, setErrorMaterialId] = useState();
    const [errorTypeId, setErrorTypeId] = useState();
    const [errorBrakesTypeId, setErrorBrakesTypeId] = useState();
    const [errorPublicBike, setErrorPublicBike] = useState();

    const [loading, setLoading] = useState(false);

    //Images
    const pickImage = async () => {
        let results = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        });

        if (!results.canceled) {
            const selectedImages = results.assets.slice(0, 5);
            const selectedImageURIs = selectedImages.map((image) => image.uri);
            setImages(selectedImageURIs);
        }
    };

    const handleSubmit = async () => {
        //Validations
        if (images.length == 0) {
            setErrorImages("Debes subir al menos una foto");
            return;
        } else {
            setErrorImages(null);
        }
        if (brand == '') {
            setErrorBrand("Este campo es obligatorio");
            return;
        } else {
            setErrorBrand(null);
        }
        if (line == '') {
            setErrorLine("Este campo es obligatorio");
            return;
        } else {
            setErrorLine(null);
        }
        if (model == '') {
            setErrorModel("Este campo es obligatorio");
            return;
        } else {
            setErrorModel(null);
        }
        if (typeId == '') {
            setErrorTypeId("Este campo es obligatorio");
            return;
        } else {
            setErrorTypeId(null);
        }
        if (materialId == '') {
            setErrorMaterialId("Este campo es obligatorio");
            return;
        } else {
            setErrorMaterialId(null);
        }
        if (publicBike == 2) {
            setErrorPublicBike("Este campo es obligatorio");
            return;
        } else {
            setErrorPublicBike(null);
        }
        if (brakesTypeId == '') {
            setErrorBrakesTypeId("Este campo es obligatorio");
            return;
        } else {
            setErrorBrakesTypeId(null);
        }
        if (description == '') {
            setErrorDescription("Este campo es obligatorio");
            return;
        } else {
            setErrorDescription(null);
        }
        //Send request
        const body = new FormData();
        //Handle image
        if (images) {
            images.forEach((image) => {
                const uriParts = image.split('.');
                const fileType = uriParts[uriParts.length - 1];
                const localUri = image;
                const filename = localUri.split('/').pop();
                body.append('bike', {
                    uri: localUri,
                    name: filename,
                    type: `image/${fileType}`,
                });
            });
        }

        body.append("brand",brand);
        body.append("model",model);
        body.append("line",line);
        body.append("description",description);
        body.append("wheel_size",wheelSize);
        body.append("wheels",wheels);
        body.append("front_groupset",frontGroupset);
        body.append("back_groupset",backGroupset);
        body.append("brakes",brakes);
        body.append("user_id",userId);
        body.append("material_id",materialId);
        body.append("type_id",typeId);
        body.append("brakes_type_id",brakesTypeId);
        body.append("public",publicBike);

        setLoading(true);
        const response = await editBicycle(bikeId,body);
        console.log(response);
        if (response.success) {
            setLoading(false);
            Alert.alert(
                'Éxito',
                'Bicicleta actualizada exitosamente',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/perfil')
                        },
                    },
                ]
            );
        } else {
            setLoading(false);
            let errorMessage;
            if (response.response.status == 500) {
                errorMessage = 'Hubo un error, intenta nuevamente por favor.';
            } else {
                errorMessage = 'Hubo un error: ' + response.response.data.data;
            }
            Alert.alert(
                'Error',
                errorMessage
            );
        }
    };

    return (
        <GeneralContainer navigation={true} title="Añadir bicicleta" icon="pedal-bike" loading={loading}>
            <ScrollView contentContainerStyle={styles.scrollContent} style={{ width: "100%" }}>
                {images &&
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return <Image source={{ uri: item }} style={styles.image} />
                        }}
                    />
                }
                {errorImages && (
                    <StyledTexts
                        color={"red"}
                        fontSize={"small"}
                        alignSelf={"flex-start"}>
                        {errorImages}
                    </StyledTexts>
                )}
                <View style={styles.row}>
                    <StyledIconButtons
                        backgroundColor={"white"}
                        onPress={() => pickImage()}
                        text="Sube fotos de tu bici"
                        textColor={"white"}>
                        <Icon name={"image-search"} size={30} color={theme.colors.orange} />
                    </StyledIconButtons>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"} style={{ marginTop: 10 }}>
                            Marca *
                        </StyledTexts>
                        <StyledInputs
                            value={brand}
                            placeholder={"GW, Giant, Pinarello, Specialized, OnTrail"}
                            style={styles.input}
                            onChangeText={(brand) => { setBrand(brand); setErrorBrand(null); }}
                            error={errorBrand}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"} style={{ marginTop: 10 }}>
                            Línea *
                        </StyledTexts>
                        <StyledInputs
                            value={line}
                            placeholder={"Flamma, Lynx, Dogma, Allez, Angliru "}
                            style={styles.input}
                            onChangeText={(line) => { setLine(line); setErrorLine(null); }}
                            error={errorLine}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Modelo *
                        </StyledTexts>
                        <StyledInputs
                            value={model}
                            placeholder={"Año"}
                            style={styles.input}
                            onChangeText={(model) => { setModel(model); setErrorModel(null); }}
                            error={errorModel}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Tipo de bici *
                        </StyledTexts>
                        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10 }}>
                            <Picker
                                selectedValue={typeId}
                                onValueChange={(itemValue) => {
                                    itemValue !== 0 && setTypeId(itemValue);
                                }
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label={"Seleccionar"} value="0" color="grey" />
                                {bikeTypes?.map((type, index) => (
                                    <Picker.Item key={"type_" + index} label={type.firstValue} value={type.id} style={{ alignSelf: "flex-start", alignContent: "flex-start", alignItems: "flex-start" }} />
                                ))
                                }
                            </Picker>
                        </View>
                        {errorTypeId && (
                            <StyledTexts
                                color={"red"}
                                fontSize={"small"}
                                alignSelf={"flex-start"}>
                                {errorTypeId}
                            </StyledTexts>
                        )}
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Material *
                        </StyledTexts>
                        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10, padding: 0 }}>
                            <Picker
                                selectedValue={materialId}
                                onValueChange={(itemValue) => {
                                    itemValue !== 0 && setMaterialId(itemValue);
                                }
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label={"Seleccionar"} value="0" color="grey" />
                                {materials?.map((type, index) => (
                                    <Picker.Item key={"material_" + index} label={type.firstValue} value={type.id} />
                                ))
                                }
                            </Picker>
                        </View>
                        {errorMaterialId && (
                            <StyledTexts
                                color={"red"}
                                fontSize={"small"}
                                alignSelf={"flex-start"}>
                                {errorMaterialId}
                            </StyledTexts>
                        )}
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Estado *
                        </StyledTexts>
                        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10 }}>
                            <Picker
                                selectedValue={publicBike}
                                onValueChange={(itemValue) => {
                                    itemValue !== 0 && setPublicBike(itemValue);
                                }
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label={"Seleccionar"} value={2} color="grey" />
                                <Picker.Item label={"PÚBLICA"} value={1} />
                                <Picker.Item label={"PRIVADA"} value={0} />
                            </Picker>
                        </View>
                        {errorPublicBike && (
                            <StyledTexts
                                color={"red"}
                                fontSize={"small"}
                                alignSelf={"flex-start"}>
                                {errorPublicBike}
                            </StyledTexts>
                        )}
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Tipo de frenos *
                        </StyledTexts>
                        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10, padding: 0 }}>
                            <Picker
                                selectedValue={brakesTypeId}
                                onValueChange={(itemValue) => {
                                    itemValue !== 0 && setBrakesTypeId(itemValue);
                                }
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label={"Seleccionar"} value="0" color="grey" />
                                {brakeTypes?.map((type, index) => (
                                    <Picker.Item key={"brakes_" + index} label={type.firstValue} value={type.id} />
                                ))
                                }
                            </Picker>
                        </View>
                        {errorBrakesTypeId && (
                            <StyledTexts
                                color={"red"}
                                fontSize={"small"}
                                alignSelf={"flex-start"}>
                                {errorBrakesTypeId}
                            </StyledTexts>
                        )}
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Especificación frenos
                        </StyledTexts>
                        <StyledInputs
                            value={brakes}
                            placeholder={"Tektro, 105, Claris"}
                            style={styles.input}
                            onChangeText={(brakes) => { setBrakes(brakes); }}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Grupo delantero
                        </StyledTexts>
                        <StyledInputs
                            value={frontGroupset}
                            placeholder={"Tourney, Claris, Sora, 105"}
                            style={styles.input}
                            onChangeText={(frontGroupset) => { setFrontGroupset(frontGroupset); }}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Grupo trasero
                        </StyledTexts>
                        <StyledInputs
                            value={backGroupset}
                            placeholder={"Tourney, Claris, Sora, 105"}
                            style={styles.input}
                            onChangeText={(backGroupset) => { setBackGroupset(backGroupset); }}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Ruedas
                        </StyledTexts>
                        <StyledInputs
                            value={wheels}
                            placeholder={"Omega, RS100, RS200"}
                            style={styles.input}
                            onChangeText={(wheels) => { setWheels(wheels); }}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"flex-start"}>
                            Tamaño ruedas
                        </StyledTexts>
                        <StyledInputs
                            value={wheelSize}
                            placeholder={"700, 26, 29"}
                            style={styles.input}
                            onChangeText={(wheelSize) => { setWheelSize(wheelSize); }}
                        />
                    </View>
                </View>
                <StyledTexts
                    color={"white"} 
                    alignSelf={"flex-start"}>
                    Descripción *
                </StyledTexts>
                <StyledInputs
                    value={description}
                    placeholder={"Comenta algo de tu bici"}
                    style={styles.input}
                    onChangeText={(description) => { setDescription(description); setErrorDescription(null) }}
                    error={errorDescription}
                    multiline
                    rows={4}
                />
                <StyledButtons backgroundColor={"white"} onPress={handleSubmit}>
                    <StyledTexts
                        color={"orange"}
                        alignSelf={"center"}
                        fontSize={"bigger"}>
                        Editar bici
                    </StyledTexts>
                </StyledButtons>
            </ScrollView>
        </GeneralContainer >
    );
}

export default BicycleEdit;
