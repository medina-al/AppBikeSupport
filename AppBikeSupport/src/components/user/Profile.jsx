//React
import { useContext, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, FlatList, Image, Pressable } from 'react-native';
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import StyledIconButtons from "../../common/StyledIconButtons";
import GeneralContainer from "../../common/GeneralContainer";
import { AuthContext } from "../../contexts/AuthContext";
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
    userCardHeader: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 5,
        backgroundColor: theme.colors.blackTransparent50
    },
    userCard: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 15,
        backgroundColor: theme.colors.blackTransparent30
    },
    image: {
        borderRadius: 100,
        width: 70,
        height: 70
    },
    bikeImage: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        width: 100,
        height: 100,
        marginBottom: 0
    },
    bikeCard: {
        borderRadius: 10,
        width: 100,
        margin: 10,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: theme.colors.whiteTransparent80
    },
    divider: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.black,
        width: "100%"
    },
});

const Profile = () => {
    const { logoutUser, userInfo } = useContext(AuthContext);
    console.log("User Info!!!!!!!!!!!!!!!!!!!!!!!!!!!", userInfo);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(userInfo);

    return (
        <GeneralContainer navigation={true} title="Mi perfil" icon="person" loading={loading}>
            <ScrollView style={styles.scrollView} >
                <View style={styles.userCardHeader}>
                    <StyledTexts fontSize={"biggest"} fontWeight={"bolder"} color={"white"}>
                        {user?.username}
                    </StyledTexts>
                </View>
                <View style={[styles.userCard, { justifyContent: "center", alignItems: "center" }]}>
                    <Image source={{ uri: apiBaseUrl + user?.image_url }} style={styles.image} />
                    <StyledTexts fontSize={"big"} fontWeight={"bold"} color={"white"}>
                        {user?.names} {user?.lastnames}
                    </StyledTexts>
                    <StyledTexts fontSize={"smaller"} color={"white"} style={{ textAlign: "justify" }}>
                        {user?.bio}
                    </StyledTexts>
                </View>
                {user?.Bicycles.length > 0 && (
                    <>
                        <View style={[styles.userCard, { paddingTop: 0, justifyContent: "center", alignItems: "center" }]}>
                            <View style={styles.divider} />
                            <View style={{ flex: 1, flexDirection: "row", alignSelf: "flex-start", justifyContent: "flex-start", alignItems: "center" }}>
                                <Icon name="person" size={20} color={"white"} marginHorizontal={10} />
                                <StyledTexts fontSize={"big"} color={"white"} alignSelf={"flex-start"} style={{ alignItems: "center" }}>
                                    Mis bicicletas
                                </StyledTexts>
                            </View>
                            <FlatList
                                data={user?.Bicycles}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => navigate('/editarBicicleta', { state: item })}>
                                        <View style={styles.bikeCard}>
                                            <Image source={{ uri: apiBaseUrl + item.BicycleImages[0].url }} style={styles.bikeImage} />
                                            <StyledTexts fontSize={"small"} color={"black"} style={{ margin: 2, textAlign: "center" }} >
                                                {item.brand} {item.line}
                                            </StyledTexts>
                                            <StyledTexts fontSize={"normal"} color={"black"} style={{ margin: 2, textAlign: "center" }} >
                                                {item.model}
                                            </StyledTexts>
                                        </View>
                                    </Pressable>
                                )}
                            />
                        </View>
                    </>
                )}
                <View style={[styles.userCard, { paddingTop: 0, justifyContent: "center", alignItems: "center" }]}>
                    <View style={styles.divider} />
                    <View style={{ flex: 1, flexDirection: "row", alignSelf: "flex-start", justifyContent: "flex-start", alignItems: "center" }}>
                        <Icon name="settings" size={20} color={"white"} marginHorizontal={10} />
                        <StyledTexts fontSize={"big"} color={"white"} alignSelf={"flex-start"} style={{ alignItems: "center" }}>
                            Acciones
                        </StyledTexts>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <StyledIconButtons
                            backgroundColor={theme.colors.white}
                            buttonSize={30}
                            text="Editar perfil"
                            textColor="white"
                            onPress={() => navigate('/editarCuenta')}>
                            <Icon name={"edit"} size={20} color={theme.colors.orange} />
                        </StyledIconButtons>
                        <StyledIconButtons
                            backgroundColor={theme.colors.white}
                            buttonSize={30}
                            text="Añadir bici"
                            textColor="white"
                            onPress={() => navigate('/crearBicicleta')}>
                            <Icon name={"pedal-bike"} size={20} color={theme.colors.orange} />
                        </StyledIconButtons>
                        <StyledIconButtons
                            backgroundColor={theme.colors.white}
                            buttonSize={30}
                            text="Cerrar sesión"
                            textColor="white"
                            onPress={() => { logoutUser(); navigate('/') }}>
                            <Icon name={"logout"} size={20} color={theme.colors.orange} />
                        </StyledIconButtons>
                    </View>
                </View>
            </ScrollView>
        </GeneralContainer>
    );
}

export default Profile;