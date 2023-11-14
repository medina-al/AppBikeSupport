//React
import { useContext, useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, Image, Alert } from 'react-native';
import { useNavigate } from "react-router-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import StyledButtons from "../../common/StyledButtons";
import StyledIconButtons from "../../common/StyledIconButtons";
import StyledInputs from "../../common/StyledInputs";
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
//External libraries
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
//Custom functions
import { formatDate } from "../../utils/dates";
//Services
import { createAssist } from "../../services/assist";
import { getLists } from "../../services/listsMaster";
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
        paddingRight: 10
    },
    picker: {
        backgroundColor: theme.colors.whiteTransparent50,
        padding: 1,
        borderRadius: 10,
    },
    mapContainer: {
        width: "100%",
        height: 300,
        backgroundColor: "red"
    },
    map: {
        width: "100%",
        height: "100%"
    }

});

const CreateAssists = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    //Form praparation
    const [bicycles, setBicycles] = useState(userInfo.Bicycles);
    const [assistTypes, setAssistTypes] = useState();
    const [images, setImages] = useState();
    //Map
    const [mapRegion, setMapRegion] = useState({
        latitude: 4.628619,
        longitude: -74.065040,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    });
    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Permiso de ubicación denegado");

        }
        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        });
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude)
    }
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

    //Form values
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [typeId, setTypeId] = useState('');
    const [bicycleId, setBicycleId] = useState('');
    //Error variables
    const [errorTitle, setErrorTitle] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [errorTypeId, setErrorTypeId] = useState('');
    const [errorBicycleId, setErrorBicycleId] = useState('');

    //Service function
    const getListsServices = async (global) => {
        const response = await getLists(global);
        if (response.success) {
            setAssistTypes(response.data);
        }
    }

    useEffect(() => {
        getListsServices("TIPO_ASISTENCIA");
        userLocation();
    }, []);

    const handleSubmit = async () => {
        //Validations
        if (title == '') {
            setErrorTitle("Este campo es obligatorio");
            return;
        } else {
            setErrorTitle(null);
        }
        if (description == '') {
            setErrorDescription("Este campo es obligatorio");
            return;
        } else {
            setErrorDescription(null);
        }
        if (typeId == '') {
            setErrorTypeId("Este campo es obligatorio");
            return;
        } else {
            setErrorTypeId(null);
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
                body.append('assist', {
                    uri: localUri,
                    name: filename,
                    type: `image/${fileType}`,
                });
            });
        }

        body.append("title", title);
        body.append("description", description);
        body.append("user_id", userInfo.id);
        body.append("type_id", typeId);
        body.append("bicycle_id", bicycleId);
        body.append("latitude", latitude);
        body.append("longitude", longitude);
        const response = await createAssist(body);
        console.log(response);
        if (response.success) {
            Alert.alert(
                'Éxito',
                'Asistencia creada exitosamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/detalleAsistencia/'+response.data.id)
                        },
                    },
                ]
            );
        } else {
            let errorMessage;
            if (response.response.status == 500) {
                errorMessage = 'Hubo un error, intenta nuevamente por favor.';
            } else {
                errorMessage = 'Hubo un error: ' + response.response.data.data;
            }
            Alert.alert(
                'Error',
                errorMessage,
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/')
                        },
                    },
                ]
            );
        }
    };
    return (
        <GeneralContainer navigation={true} title="Nueva asistencia" icon="support-agent" loading={loading}>
            <ScrollView style={styles.scrollView}>
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Título asistencia
                </StyledTexts>
                <StyledInputs
                    value={title}
                    placeholder={"Describe tu necesidad general"}
                    style={styles.input}
                    onChangeText={(title) => { setTitle(title); setErrorTitle(null); }}
                    error={errorTitle}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Detalle asistencia
                </StyledTexts>
                <StyledInputs
                    value={description}
                    placeholder={"Describe tu necesidad con mayor detalle"}
                    style={styles.input}
                    onChangeText={(description) => { setDescription(description); setErrorDescription(null); }}
                    error={errorDescription}
                    multiline
                    rows={4}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Si tú necesidad está asociada a una de tus bicis escógela
                </StyledTexts>
                <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10 }}>
                    <Picker
                        selectedValue={bicycleId}
                        onValueChange={(itemValue) => {
                            itemValue !== 0 && setBicycleId(itemValue);
                        }
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label={"Seleccionar"} value="0" color="grey" />
                        {bicycles.map((bike, index) => (
                            <Picker.Item key={"bike_" + index} label={bike.brand + " " + bike.line} value={bike.id} />
                        ))
                        }
                    </Picker>
                </View>
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Selecciona el tipo de asistencia que necesitas
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
                        {assistTypes?.map((type, index) => (
                            <Picker.Item key={"type_" + index} label={type.firstValue} value={type.id} />
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
                <StyledTexts
                    color={"white"}
                    style={{ textAlign: "center" }}>
                    ¿Tienes imágenes de tu problema? ¡Adjúntalas!{'\n'}(Puedes subir hasta 5 imágenes)
                </StyledTexts>
                <View style={{ alignItems: "center" }}>
                    <StyledIconButtons
                        backgroundColor={"white"}
                        onPress={() => pickImage()}>
                        <Icon name={"image-search"} size={30} color={theme.colors.orange} style={{ width: "auto" }} />
                    </StyledIconButtons>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {images && images.map((image, index) => (
                        <View key={index} style={{ width: '20%', padding: 5 }}>
                            <Image source={{ uri: image }} style={{ width: '100%', height: 80 }} />
                        </View>
                    ))}
                </View>
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Confirma tu ubicación, sostén el marcador y muevelo a tu ubicación exacta
                </StyledTexts>
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        region={mapRegion}
                        onRegionChange={this.onRegionChange}
                        style={styles.map}
                    >
                        <Marker
                            coordinate={mapRegion}
                            draggable
                            onDragEnd={(e) => {
                                setMapRegion({ x: e.nativeEvent.coordinate });
                                setLatitude(e.nativeEvent.coordinate.latitude);
                                setLongitude(e.nativeEvent.coordinate.longitude);
                            }}
                        />
                    </MapView>
                </View>
                <StyledButtons backgroundColor={"orange"} style={{ width: "95%" }} onPress={handleSubmit}>
                    <StyledTexts
                        color={"white"}
                        alignSelf={"center"}
                        fontSize={"bigger"}>
                        Solicitar
                    </StyledTexts>
                </StyledButtons>
            </ScrollView>
        </GeneralContainer>
    );
}

export default CreateAssists;