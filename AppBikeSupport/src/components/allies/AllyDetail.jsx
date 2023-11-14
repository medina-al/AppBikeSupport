//React
import { useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, FlatList, Image } from 'react-native';
import { useLocation } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    allyCardHeader: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 10,
        backgroundColor: theme.colors.blackTransparent50
    },
    allyCard: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 5,
        backgroundColor: theme.colors.blackTransparent30
    },
    allyCardRows: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3,
        marginHorizontal: 20
    },
    image: {
        borderRadius: 100,
        width: 150,
        height: 150
    },
    allyImage: {
        margin: 2,
        borderRadius: 10,
        width: 150,
        height: 150,
        marginBottom: 5
    },
    divider: {
        marginVertical: 2,
        marginHorizontal: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.black,
        width: "95%"
    },
    mapContainer: {
        width: "100%",
        height: 300,
    },
    map: {
        width: "100%",
        height: "100%"
    },
    contenedor: {
        flexDirection: 'column',
        justifyContent: 'flex-start', // Alinea las filas al principio verticalmente
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center', // Alinea elementos horizontalmente
        marginVertical: 0, // Elimina el espacio vertical entre filas
    },
    icono: {
        width: 20, // Ajusta el ancho de tu icono
        height: 20, // Ajusta el alto de tu icono
        marginRight: 10, // Espacio entre el icono y el texto
    },
});

const AllyDetail = () => {
    const location = useLocation();
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", location.state);
    const [ally, setAlly] = useState(location.state);
    const [mapRegion, setMapRegion] = useState({
        latitude: ally.latitude,
        longitude: ally.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    });


    return (
        <GeneralContainer navigation={true} title="Detalle aliado" icon="storefront">
            <ScrollView style={styles.scrollView} >
                <View style={styles.allyCardHeader}>
                    <StyledTexts fontSize={"biggest"} fontWeight={"bolder"} color={"white"}>
                        {ally.name}
                    </StyledTexts>
                    <StyledTexts fontSize={"smaller"} color={"white"} style={{ textAlign: "justify" }}>
                        {ally.description}
                    </StyledTexts>
                </View>
                <View style={styles.allyCard}>
                    <View style={styles.allyCardRows}>
                        <Icon name={"home-repair-service"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                        <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                            Servicios
                        </StyledTexts>
                    </View>
                    {ally.AllyServices.length > 0 &&
                        ally.AllyServices.map((service, i) => {
                            return (
                                <View key={"service_" + i}>
                                    <View style={styles.allyCardRows}>
                                        <StyledTexts fontSize={"big"} fontWeight={"bold"} color={"black"}>
                                            {'\u2022' + " " + service.service + ": "}
                                        </StyledTexts>
                                    </View>
                                    <View style={styles.allyCardRows}>
                                        <StyledTexts fontSize={"small"} fontWeight={"normal"} color={"white"} style={{ textAlign: "justify" }}>
                                            {service.description}
                                        </StyledTexts>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.allyCard}>
                    <View style={styles.divider}></View>
                </View>
                <View style={styles.allyCard}>
                    <View style={styles.allyCardRows}>
                        <Icon name={"map"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                        <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                            Ubicación
                        </StyledTexts>
                    </View>
                    <View style={styles.allyCardRows}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Dirección: {ally.address}
                        </StyledTexts>
                    </View>
                </View>
                <View style={styles.mapContainer}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MapView
                            region={mapRegion}
                            style={styles.map}
                        >
                            <Marker
                                coordinate={mapRegion}
                            />
                        </MapView>
                    </View>
                </View>
                <View style={[styles.allyCard, { flex: 1, flexDirection: "row" }]}>
                    {ally.AllySchedules.length > 0 &&
                        <View style={{ flex: 0.5 }}>
                            <View style={styles.allyCardRows}>
                                <Icon name={"pending-actions"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                                    Horario
                                </StyledTexts>
                            </View>
                            {
                                ally.AllySchedules.map((day, i) => {
                                    // Parsea las horas en objetos Date
                                    const openTime = new Date(day.open_time);
                                    const closeTime = new Date(day.close_time);

                                    // Extrae las horas y minutos
                                    const openHour = openTime.getHours();
                                    const openMinutes = openTime.getMinutes();
                                    const closeHour = closeTime.getHours();
                                    const closeMinutes = closeTime.getMinutes();

                                    const formattedOpenMinutes = openMinutes.toString().padStart(2, '0');
                                    const formattedCloseMinutes = closeMinutes.toString().padStart(2, '0');
                                    return (
                                        <View key={"day_" + i} style={styles.allyCardRows}>
                                            <StyledTexts fontSize={"small"} fontWeight={"bold"} color={"white"}>
                                                {day.ListsMaster.secondValue + ": " + openHour + ":" + formattedOpenMinutes + " - " + closeHour + ":" + formattedCloseMinutes}
                                            </StyledTexts>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    }
                    <View style={{ flex: 0.5, flexDirection: "column" }}>
                        <View style={styles.contenedor}>
                            <View style={styles.fila}>
                                <Icon name={"call"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                                    Contacto
                                </StyledTexts>
                            </View>
                            <View style={styles.fila}>
                                <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                                    {ally.phone && <>Teléfono: {ally.phone}</>}
                                </StyledTexts>
                            </View>
                            <View style={styles.fila}>
                                <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                                    Celular: {ally.mobile}
                                </StyledTexts>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.allyCard}>
                    <View style={styles.divider}></View>
                </View>
                {ally.AllyImages.length > 0 && (
                    <>
                        <View style={styles.allyCard}>
                            <View style={styles.allyCardRows}>
                                <Icon name={"photo-library"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                                    Imágenes
                                </StyledTexts>
                            </View>
                        </View>
                        <View style={[styles.allyCard, { justifyContent: "center", alignItems: "center" }]}>
                            <FlatList
                                data={ally.AllyImages}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <>
                                        <Image source={{ uri: apiBaseUrl + item.url }} style={styles.allyImage} />
                                    </>
                                )}
                            />
                        </View>
                    </>
                )}
                {ally.AllyRatings.length > 0 && (
                    <>

                        <View style={styles.allyCard}>
                            <View style={styles.divider}></View>
                            <View style={styles.allyCardRows}>
                                <Icon name={"star"} size={30} color={theme.colors.white} style={{ marginRight: 15 }} />
                                <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                                    Calificaciones
                                </StyledTexts>
                            </View>
                        </View>
                        {ally.AllyRatings.length > 0 &&
                            ally.AllyRatings.map((rate, i) => {
                                return (
                                    <View key={"rate_" + i} style={styles.allyCard}>
                                        <View style={[styles.allyCardRows,{justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5}]}>
                                            <StyledTexts fontSize={"small"} color={"white"} style={{flex: 0.8, textAlign: "justify"}}>
                                                {rate.comment}
                                            </StyledTexts>
                                            <StyledTexts fontSize={"big"} fontWeight={"bold"} color={"white"} style={{flex: 0.2, textAlign: "center", justifyContent: "flex-end"}}>
                                                {rate.rate}/5
                                            </StyledTexts>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </>
                )}
            </ScrollView>
        </GeneralContainer>
    );
}

export default AllyDetail;