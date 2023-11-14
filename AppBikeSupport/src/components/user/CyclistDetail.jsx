//React
import { useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, FlatList, Image, Pressable } from 'react-native';
import { useNavigate, useParams } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { getUsers } from "../../services/users";
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
        width: 150,
        height: 150
    },
    bikeImage: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        width: 150,
        height: 150,
        marginBottom: 5
    },
    bikeCard: {
        borderRadius: 10,
        width: 150,
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

const CyclistDetail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [user, setUser] = useState();

    //Service function
    const getUsersService = async () => {
        setLoading(true);
        const response = await getUsers(userId, null, null, null, 1);
        console.log(response.data[0].Bicycles);
        if (response.success) {
            setUser(response.data[0]);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUsersService();
    }, []);
    return (
        <GeneralContainer navigation={true} title="Detalle biciusuario" icon="directions-bike" loading={loading}>
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
                        <View style={[styles.userCard, { justifyContent: "center", alignItems: "center" }]}>
                            <View style={styles.divider} />
                            <View style={{ flex: 1, flexDirection: "row", alignSelf: "flex-start", justifyContent: "flex-start", alignItems: "center"}}>
                                <Icon name="person" size={20} color={"white"}/>
                                <StyledTexts fontSize={"big"} color={"white"} alignSelf={"flex-start"} style={{alignItems: "center"}}>
                                    Bicicletas
                                </StyledTexts>
                            </View>
                            <FlatList
                                data={user?.Bicycles}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => navigate('/detalleBicicleta', { state: item })}>
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
            </ScrollView>
        </GeneralContainer>
    );
}

export default CyclistDetail;