//React
import { useContext, useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, Image, Dimensions, Modal, Alert } from 'react-native';
import { useNavigate, useParams } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components 
import StyledTexts from "../../common/StyledTexts";
import StyledInputs from "../../common/StyledInputs";
import StyledButtons from "../../common/StyledButtons";
import StyledIconButtons from "../../common/StyledIconButtons";
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
//External libraries
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';
//Custom functions
import { formatDate } from "../../utils/dates";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { getAssist, closeAssist, cancelAssist, rateAssist } from "../../services/assist";
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    assistCardHeader: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        paddingVertical: 5,
        backgroundColor: theme.colors.blackTransparent50
    },
    assistCardBody: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        paddingVertical: 5,
        backgroundColor: theme.colors.blackTransparent30
    },
    assistCardRows: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 3,
        marginHorizontal: 20
    },
    statusBadge: {
        padding: 4,
        borderRadius: 100
    },
    divider: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.black
    },
    imagesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: 10
    },
    item: {
        width: '20%',
        aspectRatio: 1,
        margin: 5
    },
    mapContainer: {
        width: "100%",
        height: 300,
    },
    map: {
        width: "90%",
        height: "100%"
    },
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
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 260,
        borderRadius: 20
    },
    input: {
        width: "100%",
        borderWidth: 1
    },
});

const AssistDetail = () => {
    const navigate = useNavigate();
    const { assistId } = useParams();
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [assist, setAssist] = useState();

    //Map
    const [mapRegion, setMapRegion] = useState({
        latitude: 4.628619,
        longitude: -74.065040,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    });

    //Service function
    const getAssistService = async (userId, userType) => {
        const response = await getAssist(userId, userType, assistId);
        if (response.success) {
            console.log(response.data);
            setMapRegion({
                latitude: response.data[0].latitude,
                longitude: response.data[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            })
            setAssist(response.data[0]);
            setLoading(false)
        }
    }

    const [intervalActive, setIntervalActive] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAssistService(userInfo.id, userInfo.type);
        const fetchAssists = async () => {
            if (userInfo?.type === "BICIUSUARIO" && assist?.StatusAssist.id == 13) {
                getAssistService(userInfo.id, userInfo.type);
            } else {
                //Stop interval
                setIntervalActive(false);
            }
        }
        if (intervalActive) {
            const interval = setInterval(fetchAssists, 2000); // 10 segundos
            return () => {
                clearInterval(interval);
            };
        }
    }, [userInfo, assist?.StatusAssist.id]);

    //Cancel assist
    //Form values
    const [cancelNotes, setCancelNotes] = useState("");
    //Error variables
    const [errorCancelNotes, setErrorCancelNotes] = useState('');

    //Handle submit
    //Submit
    const handleCancelSubmit = async () => {
        //Validations
        if (notes == '') {
            setErrorCancelNotes("Este campo es obligatorio");
            return;
        } else {
            setErrorCancelNotes(null);
        }
        const body = {
            notes: cancelNotes,
            userId: userInfo.id,
            userType: userInfo.type,
        }
        const response = await cancelAssist(assistId, body);
        if (response.success) {
            Alert.alert(
                'Éxito',
                'Asistencia cancelada.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/asistencias')
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

    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const renderCancelModal = (
        <Modal
            animationType="slide"
            transparent={true}
            visible={cancelModalVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <StyledTexts color={"orange"} fontSize={"biggest"} fontWeight={"bold"}>
                        Cancelar asistencia
                    </StyledTexts>
                    <StyledTexts
                        color={"black"}
                        alignSelf={"flex-start"}>
                        Motivo de cancelación
                    </StyledTexts>
                    <StyledInputs
                        value={cancelNotes}
                        placeholder={"Digita el motivo de cancelación"}
                        style={styles.input}
                        onChangeText={(cancelNotes) => { setCancelNotes(cancelNotes); setErrorCancelNotes(null); }}
                        error={errorCancelNotes}
                        multiline
                        rows={3}
                    />
                    <StyledButtons backgroundColor={"orange"} onPress={() => { handleCancelSubmit() }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Cancelar asistencia
                        </StyledTexts>
                    </StyledButtons>
                    <StyledButtons backgroundColor={"white"} borderColor={theme.colors.orange} onPress={() => { setCancelModalVisible(false) }}>
                        <StyledTexts
                            color={"orange"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Cerrar ventana
                        </StyledTexts>
                    </StyledButtons>
                </View>
            </View>
        </Modal>
    )

    //Close assist
    //Form values
    const [total, setTotal] = useState("");
    const [notes, setNotes] = useState("Ninguna");
    //Error variables
    const [errorTotal, setErrorTotal] = useState('');
    const [errorNotes, setErrorNotes] = useState('');

    //Handle submit
    //Submit
    const handleCloseSubmit = async () => {
        //Validations
        if (total == '') {
            setErrorTotal("Este campo es obligatorio");
            return;
        } else {
            setErrorTotal(null);
        }
        if (notes == '') {
            setErrorNotes("Este campo es obligatorio");
            return;
        } else {
            setErrorNotes(null);
        }
        const body = {
            total: total,
            notes: notes,
            userId: userInfo.id
        }
        const response = await closeAssist(assistId, body);
        if (response.success) {
            Alert.alert(
                'Éxito',
                'Asistencia terminada exitosamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/asistencias')
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

    const [closeModalVisible, setCloseModalVisible] = useState(false);
    const renderCloseModal = (
        <Modal
            animationType="slide"
            transparent={true}
            visible={closeModalVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <StyledTexts color={"orange"} fontSize={"biggest"} fontWeight={"bold"}>
                        Terminar asistencia
                    </StyledTexts>
                    <StyledTexts
                        color={"black"}
                        alignSelf={"flex-start"}>
                        $ Total
                    </StyledTexts>
                    <StyledInputs
                        value={total}
                        placeholder={"Digita el valor total de la asistencia"}
                        style={styles.input}
                        onChangeText={(total) => { setTotal(total); setErrorTotal(null); }}
                        error={errorTotal}
                        keyboardType="phone-pad"
                    />
                    <StyledTexts
                        color={"black"}
                        alignSelf={"flex-start"}>
                        Observaciones de cierre
                    </StyledTexts>
                    <StyledInputs
                        value={notes}
                        placeholder={"Digita alguna nota u observación"}
                        style={styles.input}
                        onChangeText={(notes) => { setNotes(notes); setErrorNotes(null); }}
                        error={errorNotes}
                        multiline
                        rows={3}
                    />
                    <StyledButtons backgroundColor={"orange"} onPress={() => { handleCloseSubmit() }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Terminar asistencia
                        </StyledTexts>
                    </StyledButtons>
                    <StyledButtons backgroundColor={"white"} borderColor={theme.colors.orange} onPress={() => { setCloseModalVisible(false) }}>
                        <StyledTexts
                            color={"orange"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Cerrar ventana
                        </StyledTexts>
                    </StyledButtons>
                </View>
            </View>
        </Modal>
    )

    //Rate assist
    //Form values
    const [rate, setRate] = useState(5);
    const [comment, setComment] = useState("");
    //Error variables
    const [errorRate, setErrorRate] = useState('');
    const [errorComment, setErrorComment] = useState('');

    //Handle submit
    //Submit
    const handleRateSubmit = async () => {
        //Validations
        if (rate == '') {
            setErrorRate("Este campo es obligatorio");
            return;
        } else {
            setErrorRate(null);
        }
        if (comment == '') {
            setErrorComment("Este campo es obligatorio");
            return;
        } else {
            setErrorComment(null);
        }
        const body = {
            rate: rate,
            comment: comment,
            ally_id: assist?.Ally.id
        }
        const response = await rateAssist(assistId, body);
        if (response.success) {
            Alert.alert(
                'Éxito',
                'Asistencia calificada exitosamente.',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/asistencias')
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

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < rate; i++) {
            stars.push(
                <Icon key={i} name="star" size={40} color={theme.colors.orange} style={{ margin: 0 }} />
            );
        }
        return stars;
    };

    const [rateModalVisible, setRateModalVisible] = useState(false);
    const renderRateModal = (
        <Modal
            animationType="slide"
            transparent={true}
            visible={rateModalVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <StyledTexts color={"orange"} fontSize={"biggest"} fontWeight={"bold"}>
                        Calificar asistencia
                    </StyledTexts>
                    <StyledTexts
                        color={"black"}
                        alignSelf={"flex-start"}>
                        Observaciones de cierre
                    </StyledTexts>
                    <StyledInputs
                        value={comment}
                        placeholder={"¿Qué tal estuvo esta asistencia?"}
                        style={styles.input}
                        onChangeText={(comment) => { setComment(comment); setErrorComment(null); }}
                        error={errorComment}
                        multiline
                        rows={3}
                    />
                    <StyledTexts
                        color={"black"}
                        alignSelf={"flex-start"}>
                        Calificación
                    </StyledTexts>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={5}
                        value={rate}
                        step={1}
                        thumbTintColor={theme.colors.orange}
                        minimumTrackTintColor={theme.colors.orange}
                        maximumTrackTintColor={theme.colors.black}
                        onValueChange={(value) => setRate(value)}
                    />
                    <StyledTexts>
                       {renderStars()}
                    </StyledTexts>
                    <StyledButtons backgroundColor={"orange"} onPress={() => { handleRateSubmit() }}>
                        <StyledTexts
                            color={"white"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Calificar asistencia
                        </StyledTexts>
                    </StyledButtons>
                    <StyledButtons backgroundColor={"white"} borderColor={theme.colors.orange} onPress={() => { setCloseModalVisible(false) }}>
                        <StyledTexts
                            color={"orange"}
                            alignSelf={"center"}
                            fontSize={"bigger"}>
                            Cerrar ventana
                        </StyledTexts>
                    </StyledButtons>
                </View>
            </View>
        </Modal>
    )

    return (
        <GeneralContainer navigation={true} title="Detalle asistencia" icon="support-agent" loading={loading}>
            {renderCloseModal}
            {renderCancelModal}
            {renderRateModal}
            <ScrollView style={styles.scrollView}>
                <View style={[styles.assistCardHeader, { backgroundColor: theme.colors.blackTransparent70 }]}>
                    <View style={styles.assistCardRows}>
                        <StyledTexts fontSize={"big"} color={"white"} fontWeight={"bold"}>
                            {assist?.title}
                        </StyledTexts>
                        {assist?.StatusAssist && (
                            <View style={[styles.statusBadge, { backgroundColor: theme.colors[assist?.StatusAssist.thirdValue] }]}>
                                <StyledTexts fontSize={"small"} color={"white"} fontWeight={"bold"}>
                                    {assist?.StatusAssist.firstValue}
                                </StyledTexts>
                            </View>
                        )}
                    </View>
                    <View style={styles.assistCardRows}>
                        {(assist?.AllyRating) && (
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                {Array.from({ length: assist?.AllyRating.rate }, (_, i) => (
                                    <Icon key={`rating_${i}`} name="star" size={15} color={theme.colors.yellow} style={{ margin: 0 }} />
                                ))}
                            </View>
                        )}
                        <StyledTexts fontSize={"big"} color={"white"}>
                            {assist?.TypeAssist.firstValue}
                        </StyledTexts>
                    </View>
                </View>
                <View style={[styles.assistCardHeader, { flexDirection: "row" }]}>
                    {(assist?.AllyRating != null) && (userInfo.type == 'BICIUSUARIO') &&
                        <View style={styles.assistCardRows}>
                            <StyledIconButtons
                                backgroundColor={theme.colors.white}
                                buttonSize={30}
                                text="Calificar"
                                textColor="white"
                                onPress={() => setRateModalVisible(true)}>
                                <Icon name={"star"} size={20} color={theme.colors.orange} />
                            </StyledIconButtons>
                        </View>
                    }
                    {(assist?.StatusAssist.id == 12) &&
                        <View style={styles.assistCardRows}>
                            <StyledIconButtons
                                backgroundColor={theme.colors.white}
                                buttonSize={30}
                                text="Mensaje"
                                textColor="white"
                                onPress={() => navigate('/chatAsistencia/' + assist?.id)}>
                                <Icon name={"chat"} size={20} color={theme.colors.orange} />
                            </StyledIconButtons>
                        </View>
                    }
                    {(assist?.StatusAssist.id == 12 && userInfo.type == 'TÉCNICO') &&
                        <View style={styles.assistCardRows}>
                            <StyledIconButtons
                                backgroundColor={theme.colors.white}
                                buttonSize={30}
                                text="Cerrar"
                                textColor="white"
                                onPress={() => setCloseModalVisible(true)}>
                                <Icon name={"check"} size={20} color={theme.colors.orange} />
                            </StyledIconButtons>
                        </View>
                    }
                    {(assist?.StatusAssist.id == 12 || assist?.StatusAssist.id == 13) &&
                        <View style={styles.assistCardRows}>
                            <StyledIconButtons
                                backgroundColor={theme.colors.red}
                                buttonSize={30}
                                text="Cancelar"
                                textColor="white"
                                onPress={() => setCancelModalVisible(true)}>
                                <Icon name={"close"} size={20} color={theme.colors.white} />
                            </StyledIconButtons>
                        </View>
                    }
                </View>
                <View style={styles.assistCardBody}>
                    <View style={styles.assistCardRows}>
                        <StyledTexts fontSize={"normal"} color={"white"} fontWeight={"bold"}>
                            Descripción:
                        </StyledTexts>
                    </View>
                    <View style={styles.assistCardRows}>
                        <StyledTexts fontSize={"small"} color={"white"}>
                            {assist?.description}
                        </StyledTexts>
                    </View>
                    {

                        (userInfo.type == 'TÉCNICO' && assist?.UserAssist) ? (
                            <View style={styles.assistCardRows}>
                                <StyledTexts fontSize={"smaller"} color={"white"}>
                                    Usuario: {assist?.UserAssist.names} {assist?.UserAssist.lastnames}
                                </StyledTexts>
                                <StyledTexts fontSize={"smaller"} color={"white"}>
                                    Celular: {assist?.UserAssist.mobile}
                                </StyledTexts>
                            </View>
                        ) : (
                            (
                                assist?.TechnicianAssist &&
                                <>
                                    <View style={styles.assistCardRows}>
                                        <StyledTexts fontSize={"smaller"} color={"white"}>
                                            Técnico: {assist?.TechnicianAssist.names} {assist?.TechnicianAssist.lastnames}
                                        </StyledTexts>
                                        <StyledTexts fontSize={"smaller"} color={"white"}>
                                            Celular: {assist?.TechnicianAssist.mobile}
                                        </StyledTexts>
                                    </View>
                                    <View style={styles.assistCardRows}>
                                        <StyledTexts fontSize={"smaller"} color={"white"}>
                                            Aliado asignado: {assist?.Ally.name}
                                        </StyledTexts>
                                        <StyledTexts fontSize={"smaller"} color={"white"}>
                                            Contacto: {assist?.Ally.phone} / {assist?.Ally.mobile}
                                        </StyledTexts>
                                    </View>
                                </>
                            )
                        )
                    }
                    <View style={styles.divider} />
                    <View style={[styles.assistCardRows, { justifyContent: "flex-start" }]}>
                        <Icon name={"timer"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                        <StyledTexts fontSize={"normal"} color={"white"} fontWeight={"bold"}>
                            Fechas/horas
                        </StyledTexts>
                    </View>
                    <View style={styles.assistCardRows}>
                        <StyledTexts fontSize={"small"} color={"white"} fontWeight={"bold"}>
                            Fecha de apertura:
                        </StyledTexts>
                        <StyledTexts fontSize={"small"} color={"white"}>
                            {formatDate(assist?.open_time)}
                        </StyledTexts>
                    </View>
                    {
                        assist?.attention_time &&
                        <View style={styles.assistCardRows}>
                            <StyledTexts fontSize={"small"} color={"white"} fontWeight={"bold"}>
                                Fecha de atención:
                            </StyledTexts>
                            <StyledTexts fontSize={"small"} color={"white"}>
                                {formatDate(assist?.attention_time)}
                            </StyledTexts>
                        </View>
                    }
                    {
                        assist?.close_time &&
                        <View style={styles.assistCardRows}>
                            <StyledTexts fontSize={"small"} color={"white"} fontWeight={"bold"}>
                                Fecha de cierre:
                            </StyledTexts>
                            <StyledTexts fontSize={"small"} color={"white"}>
                                {formatDate(assist?.close_time)}
                            </StyledTexts>
                        </View>
                    }
                    <View style={styles.divider} />
                    {assist?.AssistImages &&
                        <>
                            <View style={[styles.assistCardRows, { justifyContent: "flex-start" }]}>
                                <Icon name={"image"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"normal"} color={"white"}>
                                    Imágenes
                                </StyledTexts>
                            </View>
                            <View style={styles.assistCardRows}>
                                {assist?.AssistImages.map((image, index) => (
                                    <View key={"image_" + index} style={{ width: '20%', padding: 5 }}>
                                        <Image source={{ uri: apiBaseUrl + image.url }} style={{ width: '100%', height: 80, borderRadius: 10 }} />
                                    </View>
                                ))
                                }
                            </View>
                        </>
                    }
                    <View style={styles.divider} />
                    <View style={[styles.assistCardRows, { justifyContent: "flex-start" }]}>
                        <Icon name={"map"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                        <StyledTexts fontSize={"normal"} color={"white"}>
                            Ubicación
                        </StyledTexts>
                    </View>
                    <View style={styles.mapContainer}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                region={mapRegion}
                                style={styles.map}
                            >
                                <Marker
                                    coordinate={mapRegion}
                                />
                            </MapView>
                        </View>
                    </View>
                    {assist?.Bicycle &&
                        <>
                            <View style={styles.divider} />
                            <View style={[styles.assistCardRows, { justifyContent: "flex-start" }]}>
                                <Icon name={"pedal-bike"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"normal"} color={"white"}>
                                    {assist?.Bicycle.brand + " " + assist?.Bicycle.line + " " + assist?.Bicycle.model}
                                </StyledTexts>
                            </View>
                            {assist?.Bicycle.BicycleImages &&
                                <View style={styles.imagesContainer}>
                                    {assist?.Bicycle.BicycleImages.map((image, index) => (
                                        <View key={"bike_" + index} style={styles.item}>
                                            <Image source={{ uri: apiBaseUrl + image.url }} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                                        </View>
                                    ))}
                                </View>
                            }
                        </>
                    }
                    {assist?.total &&
                        <>
                            <View style={styles.divider} />
                            <View style={[styles.assistCardRows, { justifyContent: "flex-start" }]}>
                                <Icon name={"payments"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"normal"} color={"white"}>
                                    Costos
                                </StyledTexts>
                            </View>
                            <View style={styles.assistCardRows}>
                                <StyledTexts fontSize={"normal"} color={"white"} fontWeight={"bold"}>
                                    Total:
                                </StyledTexts>
                                <StyledTexts fontSize={"normal"} color={"white"}>
                                    ${assist?.total}
                                </StyledTexts>
                            </View>
                            {assist?.notes &&
                                <>
                                    <View style={styles.assistCardRows}>
                                        <StyledTexts fontSize={"normal"} color={"white"} fontWeight={"bold"}>
                                            Notas de cierre:
                                        </StyledTexts>
                                    </View>
                                    <View style={styles.assistCardRows}>
                                        <StyledTexts fontSize={"normal"} color={"white"} fontWeight={"bold"}>
                                            {assist?.notes}
                                        </StyledTexts>
                                    </View>
                                </>
                            }
                        </>
                    }
                </View>
            </ScrollView>
        </GeneralContainer >
    );
}

export default AssistDetail;