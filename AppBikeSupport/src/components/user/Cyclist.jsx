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
import { getUsers } from "../../services/users";
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    userCard: {
        flex: 1,
        flexDirection: "column",
        margin: 5,
        width: "95%",
        padding: 5,
        borderRadius: 10,
        backgroundColor: theme.colors.blackTransparent50
    },
    image: {
        borderRadius: 10,
        width: 80,
        height: 80
    }
});

const Cyclist = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState();
    const [refreshing, setRefreshing] = useState(false);

    //Service function
    const getUsersService = async () => {
        setLoading(true);
        const response = await getUsers(null, 'BICIUSUARIO', 'ACTIVO', 1,1);
        console.log(response);
        if (response.success) {
            setUsers(response.data);
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        getUsersService();
    }

    const renderBikes = (number) => {
        const bikes = [];
        for (let i = 0; i < number; i++) {
            bikes.push(
                <Icon key={"bike_" + i} size={20} name={"pedal-bike"} color={"white"} margin={5} />
            );
        }
        return bikes;
    };

    const renderUsers = users &&
        users.length > 0 &&
        users.map((user, index) => {
            return (
                <View key={"user_" + index}
                    style={styles.userCard}>
                    <Pressable onPress={() => { navigate('/detalleBiciusuario/' + user.id) }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                                <Image source={{ uri: apiBaseUrl + user.image_url }} style={styles.image} />
                            </View>
                            <View style={{ flex: 0.7, padding: 10 }}>
                                <StyledTexts fontSize={"bigger"} fontWeight={"bold"} color={"white"}>
                                    {user.username}
                                </StyledTexts>
                                <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                                    {user.names} {user.lastnames}
                                </StyledTexts>
                                <StyledTexts fontSize={"smaller"} color={"white"} style={{ textAlign: "justify" }}>
                                    {user.bio}
                                </StyledTexts>
                                {user.Bicycles.length > 0 && (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <StyledTexts fontSize={"big"} color={"white"}>
                                            Bicicletas
                                        </StyledTexts>
                                        {renderBikes(user.Bicycles.length)}
                                    </View>
                                )}
                            </View>
                        </View>
                    </Pressable>
                </View>
            )
        });

    useEffect(() => {
        getUsersService();
    }, []);
    return (
        <GeneralContainer navigation={true} title="Biciusuarios" icon="groups" loading={loading}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.colors.orange} 
                        colors={[theme.colors.white, theme.colors.yellow]} 
                        progressBackgroundColor={theme.colors.orange}
                    />
                }>
                {renderUsers}
            </ScrollView>
        </GeneralContainer>
    );
}

export default Cyclist;