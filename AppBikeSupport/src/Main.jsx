//React & React Native
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, BackHandler, Alert } from "react-native";
import { Routes, Route, useNavigate } from "react-router-native";
//Expo
import Constants from 'expo-constants'
//Services
import { getOpenAssists, assignAssist } from "./services/assist";
//Custom Components
import { AuthContext } from "./contexts/AuthContext";
//Session
import Login from "./components/session/Login";
import CreateAccount from "./components/user/manage/CreateAccount";
//Home
import Home from "./Home"; 
//Assists
import HomeAssists from "./components/assist/HomeAssists";
import CreateAssists from "./components/assist/CreateAssists";
import AssistDetail from "./components/assist/AssistDetail";
import ChatAssist from "./components/assist/ChatAssist";
//User Profile
import Profile from "./components/user/Profile";

const Main = () => {
    const navigate = useNavigate();
    const { isLoading, userToken, userInfo } = useContext(AuthContext);
    const [foundOpenAssist, setFoundOpenAssist] = useState(false);

    const goBack = () => {
        navigate(-1);
    };

    const handleBackPress = () => {
        goBack();
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []);

    const assignAssistService = async (assistId,userId) => {
        try {
            const response = await assignAssist(assistId,userId);
            if (response.success) {
                navigate('/detalleAsistencia/'+assistId);
            }else{
                console.log(response.response);
            }
        } catch (error) {
            console.error("Error al asignar la asistencia:", error);
        }
    }

    useEffect(() => {
        // Función que se ejecuta cada 10 segundos
        const fetchOpenAssists = async () => {
            if (!foundOpenAssist && userInfo?.type === "TÉCNICO") {
                try {
                    const response = await getOpenAssists(userInfo?.id);
                    if (response.data !== null) {
                        Alert.alert(
                            "Nueva asistencia disponible",
                            "Título: " + response.data.title + ". Distancia: " + response.data.distance + " kilómetros",
                            [  
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        setFoundOpenAssist(true);
                                        assignAssistService(response.data.id,userInfo?.id);
                                    }
                                },
                                {
                                    text: 'Rechazar',
                                    onPress: () => {
                                        setFoundOpenAssist(false);
                                    }
                                },
                            ]
                        );
                        setFoundOpenAssist(true);
                    }
                } catch (error) {
                    console.error("Error al obtener asistencias abiertas:", error);
                }
            }
        };

        const interval = setInterval(fetchOpenAssists, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [userInfo?.type, foundOpenAssist]);

    //Custom styles
    const styles = StyleSheet.create({
        container: {
            marginTop: Constants.statusBarHeight,
            flexGrow: 1,
        },
        loading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });


    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size={'large'} style={styles.loading} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Routes>
                {userToken !== null ?
                    <Route path="/" element={<Home />} /> :
                    <Route path="/" element={<Login />} />
                }
                <Route path="/asistencias" element={<HomeAssists />} />
                <Route path="/crearAsistencia" element={<CreateAssists />} />
                <Route path="/detalleAsistencia/:assistId" element={<AssistDetail />} />
                <Route path="/chatAsistencia/:assistId" element={<ChatAssist />} />

                <Route path="/crearCuenta" element={<CreateAccount />} />
                <Route path="/perfil" element={<Profile />} />
            </Routes>
        </View>
    );
}

export default Main;