//React
import { useContext, useState, useEffect } from "react";
//React Native
import { Modal, View, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "./common/StyledTexts";
import StyledButtons from "./common/StyledButtons";
import StyledIconButtons from "./common/StyledIconButtons";
import StyledInputs from "./common/StyledInputs";
import { AuthContext } from "./contexts/AuthContext";
import GeneralContainer from "./common/GeneralContainer";
//External libraries
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
//Services
import { verifyAccount } from "./services/users";
import { getMaps } from "./services/maps";
//Custom styles
import theme from "./common/styles/theme";

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        padding: 35,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    input: {
        width: "100%",
        borderWidth: 1
    },
    map: {
        width: "100%",
        height: "100%"
    },
    layersContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        right: 10
    },
    markerCallout:{
        wdith: 200
    }
});

const Home = () => {
    const { updateUser, userInfo } = useContext(AuthContext);
    //console.log("User Info!!!!!!!!!!!!!!!!!!!!!!!!!!!",userInfo);
    const [modalVisible, setModalVisible] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 4.628619,
        longitude: -74.065040,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8
    });
    const [markers, setMarkers] = useState();
    const [layers, setLayers] = useState({});
    const [activeLayer, setActiveLayer] = useState(1);
    const [currentLayer, setCurrentLayer] = useState("");

    //Form values
    const [code, setCode] = useState('');
    //Error variables
    const [errorCode, setErrorCode] = useState('');

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Permiso de ubicación denegado");
        }
        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
        })
        console.log("Coordenadas//////////////////",location.coords.latitude, location.coords.longitude);
    }

    const getLayers = async () => {
        const response = await getMaps();
        if (response.success) {
            setLayers(response.data);
        }
    }

    const renderLayers = layers &&
        layers.length > 0 &&
        layers.map((layer, index) => {
            return (
                <StyledIconButtons key={"layer_" + index}
                    backgroundColor={activeLayer == layer.id ? theme.colors.orange : theme.colors.white}
                    onPress={() => getMapPoints(layer.id)}>
                    <Icon name={layer.icon} size={30} color={activeLayer == layer.id ? theme.colors.white : theme.colors.orange} />
                </StyledIconButtons>)
        });

    const getMapPoints = async (id) => {
        setActiveLayer(id)
        const response = await getMaps(id);
        if (response.success) {
            setCurrentLayer(response.data[0].name);
            const mapPoints = response.data[0].MapPoints;
            const formattedPoints = [];
            mapPoints.map((point) => {
                formattedPoints.push({
                    title: point.title,
                    description: point.description,
                    schedule: point.schedule,
                    icon: response.data[0].marker_icon,
                    coordinate: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                    },
                })
            })
            setMarkers(formattedPoints);
        }
    }

    const CustomMarker = ({ title, description,schedule }) => {
        return (
            <View style={styles.markerCallout}>
                <StyledTexts fontSize={"big"} color={"orange"}>
                    {title}
                </StyledTexts>
                <StyledTexts style={{textAlign: "justify"}}>
                    {description}
                </StyledTexts>
                <StyledTexts style={{textAlign: "justify"}}>
                    {schedule}
                </StyledTexts>
            </View>
        );
    }

    //Execute first time
    useEffect(() => {
        if (userInfo.code == null) {
            setModalVisible(false);
        } else {
            setModalVisible(true);
        }
        getLayers();
        getMapPoints(1);
        userLocation();
    }, [userInfo.code, modalVisible]);

    //Submit
    const handleSubmit = async () => {
        //Validations
        if (code == '') {
            setErrorCode("Este campo es obligatorio");
            return;
        } else {
            setErrorCode(null);
        }
        const body = {
            code: code,
            userId: userInfo.id
        }
        const response = await verifyAccount(body);
        if (response.success) {
            Alert.alert(
                'Éxito',
                'Cuenta verificada exitosamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            setModalVisible(false);
                            updateUser(response.data)
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
                    },
                ]
            );
        }
    }
    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <StyledTexts color={"orange"} fontSize={"biggest"} fontWeight={"bold"}>
                            Bienvenido {userInfo.username}
                        </StyledTexts>
                        <StyledTexts color={"black"} fontSize={"normal"}>
                            Es la primera vez que accedes a Bike Support, para verificar tu cuenta por favor digita el código que recibiste en tu correo:
                        </StyledTexts>
                        <StyledInputs
                            value={code}
                            placeholder={"Digita tu código de verificación"}
                            style={styles.input}
                            onChangeText={(code) => { setCode(code); setErrorCode(null); }}
                            error={errorCode}
                        />
                        <StyledButtons backgroundColor={"orange"} onPress={handleSubmit}>
                            <StyledTexts
                                color={"white"}
                                alignSelf={"center"}
                                fontSize={"bigger"}>
                                Verificar cuenta
                            </StyledTexts>
                        </StyledButtons>
                    </View>
                </View>
            </Modal>
            <GeneralContainer navigation={true} title={"Inicio - "+currentLayer} icon="home-filled" containerStyles={{ padding: 0 }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    region={mapRegion}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}
                >
                    <Marker coordinate={mapRegion} />
                    {markers?.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker.coordinate}
                        >
                            <Icon name={marker.icon} size={30} color={theme.colors.orange} />
                            <Callout style={{width: 300}}>
                                <CustomMarker {...marker} />
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
                <View style={styles.layersContainer}>
                    {renderLayers}
                </View>
            </GeneralContainer >
        </>
    );
}

export default Home;