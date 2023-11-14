//React
import { useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, Pressable, Image, RefreshControl } from 'react-native';
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { getAllies } from "../../services/allies";
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
        flexDirection: "row",
        width: "100%",
        padding: 5,
        backgroundColor: theme.colors.blackTransparent50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    allyCard: {
        flex: 1,
        flexDirection: "column",
        margin: 5,
        width: "95%",
        borderRadius: 10,
        backgroundColor: theme.colors.blackTransparent50
    },
    image: {
        borderRadius: 10,
        width: 120,
        height: 120
    }
});

const HomeAllies = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allies, setAllies] = useState();
    const [refreshing, setRefreshing] = useState(false);

    //Service function
    const getAlliesService = async () => {
        setLoading(true);
        const response = await getAllies(null, 'ACTIVO');
        console.log(response);
        if (response.success) {
            setAllies(response.data);
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        getAlliesService();
    }

    const renderStars = (number) => {
        const stars = [];
        for (let i = 0; i < number; i++) {
            stars.push(
                <Icon key={"star_" + i} size={20} name={"star"} color={"yellow"} margin={5} />
            );
        }
        return stars;
    };

    const renderAllies = allies &&
        allies.length > 0 &&
        allies.map((ally, index) => {
            return (
                <Pressable key={"ally_" + index} onPress={() => { navigate('/detalleAliado/', { state: ally }) }}>
                    <View style={styles.allyCard}>
                        <View style={styles.allyCardHeader}>
                            <View style={{ flex: 0.7, padding: 10 }}>
                                <StyledTexts fontSize={"bigger"} fontWeight={"bold"} color={"white"}>{ally.name}</StyledTexts>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                                {renderStars(ally.averageRating)}
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
                            <View style={{ flex: 0.5, justifyContent: "center" }}>
                                <View style={{ flexDirection: "row", margin: 5 }}>
                                    <Icon size={20} name={"my-location"} color={"white"} marginRight={10} />
                                    <StyledTexts fontSize={"normal"} color={"white"}>
                                        {ally.address}
                                    </StyledTexts>
                                </View>
                                {ally.phone &&
                                    <View style={{ flexDirection: "row", margin: 5 }}>
                                        <Icon size={20} name={"call"} color={"white"} marginRight={10} />
                                        <StyledTexts fontSize={"normal"} color={"white"}>
                                            {ally.phone}
                                        </StyledTexts>
                                    </View>
                                }
                                <View style={{ flexDirection: "row", margin: 5 }}>
                                    <Icon size={20} name={"smartphone"} color={"white"} marginRight={10} />
                                    <StyledTexts fontSize={"normal"} color={"white"}>
                                        {ally.mobile}
                                    </StyledTexts>
                                </View>
                            </View>
                            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                                <Image source={{ uri: apiBaseUrl + ally.AllyImages[0].url }} style={styles.image} />
                            </View>
                        </View>
                    </View>
                </Pressable>
            )
        });

    useEffect(() => {
        getAlliesService();
    }, []);
    return (
        <GeneralContainer navigation={true} title="Aliados" icon="storefront" loading={loading}>
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
                {renderAllies}
            </ScrollView>
        </GeneralContainer>
    );
}

export default HomeAllies;