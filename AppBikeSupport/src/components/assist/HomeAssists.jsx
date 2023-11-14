//React
import { useContext, useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, Pressable, RefreshControl } from 'react-native';
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { formatDate } from "../../utils/dates";
//Services
import { getAssist } from "../../services/assist";
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    assistCard: {
        flex: 1,
        flexDirection: "column",
        margin: 5,
        width: "95%",
        paddingBottom: 5,
        borderRadius: 10,
        backgroundColor: theme.colors.blackTransparent50
    },
    assistCardHeader: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        paddingVertical: 5,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        backgroundColor: theme.colors.blackTransparent50
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
});

const HomeAssists = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [assists, setAssists] = useState();
    const [refreshing, setRefreshing] = useState(false);

    //Service function
    const getAssistService = async (userId, userType) => {
        setLoading(true);
        const response = await getAssist(userId, userType);
        if (response.success) {
            setAssists(response.data);
            setLoading(false);
        }
    }

    const renderAssists = assists &&
        assists.length > 0 &&
        assists.map((assist, index) => {
            return (
                <View key={"assist_" + index}
                    style={styles.assistCard}>
                    <Pressable onPress={() => { navigate('/detalleAsistencia/' + assist.id) }}>
                        <View
                            style={styles.assistCardHeader}>
                            <View style={styles.assistCardRows}>
                                <StyledTexts fontSize={"big"} color={"white"} fontWeight={"bold"}>
                                    {assist.title}
                                </StyledTexts>
                                <View style={[styles.statusBadge, { backgroundColor: theme.colors[assist.StatusAssist.thirdValue] }]}>
                                    <StyledTexts fontSize={"small"} color={"white"} fontWeight={"bold"}>
                                        {assist.StatusAssist.firstValue}
                                    </StyledTexts>
                                </View>
                            </View>
                            <View style={styles.assistCardRows}>
                                {(userInfo.type === 'BICIUSUARIO') && (assist.AllyRating) ? (
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        {Array.from({ length: assist.AllyRating.rate }, (_, i) => (
                                            <Icon key={`rating_${i}`} name="star" size={15} color={theme.colors.yellow} style={{ margin: 0 }} />
                                        ))}
                                    </View>
                                ) : (
                                    <View>
                                    </View>
                                )}
                                <StyledTexts fontSize={"big"} color={"white"}>
                                    {assist.TypeAssist.firstValue}
                                </StyledTexts>
                            </View>
                        </View>
                        {

                            (userInfo.type == 'TÉCNICO' && assist.UserAssist) ? (
                                <View style={styles.assistCardRows}>
                                    <StyledTexts fontSize={"smaller"} color={"white"}>
                                        Usuario: {assist.UserAssist.names} {assist.UserAssist.lastnames}
                                    </StyledTexts>
                                    <StyledTexts fontSize={"smaller"} color={"white"}>
                                        Celular: {assist.UserAssist.mobile}
                                    </StyledTexts>
                                </View>
                            ) : (
                                (
                                    assist.TechnicianAssist &&
                                    <>
                                        <View style={styles.assistCardRows}>
                                            <StyledTexts fontSize={"smaller"} color={"white"}>
                                                Técnico: {assist.TechnicianAssist.names} {assist.TechnicianAssist.lastnames}
                                            </StyledTexts>
                                            <StyledTexts fontSize={"smaller"} color={"white"}>
                                                Celular: {assist.TechnicianAssist.mobile}
                                            </StyledTexts>
                                        </View>
                                        <View style={styles.assistCardRows}>
                                            <StyledTexts fontSize={"smaller"} color={"white"}>
                                                Aliado asignado: {assist.Ally.name}
                                            </StyledTexts>
                                            <StyledTexts fontSize={"smaller"} color={"white"}>
                                                Contacto: {assist.Ally.mobile} / {assist.Ally.mobile}
                                            </StyledTexts>
                                        </View>
                                    </>
                                )
                            )
                        }
                        <View style={styles.assistCardRows}>
                            <StyledTexts fontSize={"small"} color={"white"}>
                                Fecha apertura: {formatDate(assist.open_time)}
                            </StyledTexts>
                        </View>
                        {(assist.attention_time) &&
                            <View style={styles.assistCardRows}>
                                <StyledTexts fontSize={"small"} color={"white"}>
                                    Fecha inicial atención: {formatDate(assist.attention_time)}
                                </StyledTexts>
                            </View>
                        }
                        {(assist.close_time) &&
                            <View style={styles.assistCardRows}>
                                <StyledTexts fontSize={"small"} color={"white"}>
                                    Fecha cierre: {formatDate(assist.close_time)}
                                </StyledTexts>
                            </View>
                        }
                    </Pressable>
                </View>
            )
        });

    const handleRefresh = () => {
        getAssistService(userInfo.id, userInfo.type);
    }

    useEffect(() => {
        getAssistService(userInfo.id, userInfo.type);
    }, []);
    return (
        <GeneralContainer navigation={true} title="Asistencias" icon="support-agent" loading={loading}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={ // Agregar el componente RefreshControl
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.colors.orange} // Cambia el color de la animación de recarga
                        colors={[theme.colors.white, theme.colors.yellow]} // Cambia los colores de la animación de recarga
                        progressBackgroundColor={theme.colors.orange}
                    />
                }>
                <Pressable onPress={() => { navigate('/crearAsistencia') }}>
                    <View style={[styles.assistCard, { justifyContent: "center", alignItems: "center", padding: 10, paddingBottom: 10 }]}>
                        <Icon name="add-circle" size={40} color={theme.colors.white} />
                        <StyledTexts color={"white"}>
                            Solicitar nueva asistencia
                        </StyledTexts>
                    </View>
                </Pressable>
                {renderAssists}
            </ScrollView>
        </GeneralContainer>
    );
}

export default HomeAssists;