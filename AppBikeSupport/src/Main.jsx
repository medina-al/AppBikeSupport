//React & React Native
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, BackHandler, StatusBar, Alert } from "react-native";
import { Routes, Route, useNavigate } from "react-router-native";
//Expo
import Constants from 'expo-constants'
//Services
import { getOpenAssists, assignAssist } from "./services/assist";
//Custom Components
import { AuthContext } from "./contexts/AuthContext";
//Session
import Login from "./components/session/Login";
import AccountCreate from "./components/user/manage/AccountCreate";
//Home
import Home from "./Home"; 
//Allies
import HomeAllies from "./components/allies/HomeAllies";
import AllyDetail from "./components/allies/AllyDetail";
//Assists
import HomeAssists from "./components/assist/HomeAssists";
import CreateAssists from "./components/assist/CreateAssists";
import AssistDetail from "./components/assist/AssistDetail";
import ChatAssist from "./components/assist/ChatAssist";
//Recommendations
import HomeRecommendations from "./components/recommendations/HomeRecommendations";
//User Profile
import AccountEdit from "./components/user/manage/AccountEdit";
import Profile from "./components/user/Profile";
import Cyclist from "./components/user/Cyclist";
import CyclistDetail from "./components/user/CyclistDetail";
import BicycleDetail from "./components/user/BicycleDetail";
import BicycleCreate from "./components/user/BicycleCreate";
import BicycleEdit from "./components/user/BicycleEdit";

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
        console.log(Constants.statusBarHeight);
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
            marginTop: 8,
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
                
                <Route path="/aliados" element={<HomeAllies />} />
                <Route path="/detalleAliado" element={<AllyDetail />} />
                
                <Route path="/asistencias" element={<HomeAssists />} />
                <Route path="/crearAsistencia" element={<CreateAssists />} />
                <Route path="/detalleAsistencia/:assistId" element={<AssistDetail />} />
                <Route path="/chatAsistencia/:assistId" element={<ChatAssist />} />

                <Route path="/crearCuenta" element={<AccountCreate />} />
                <Route path="/editarCuenta" element={<AccountEdit />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/biciusuarios" element={<Cyclist />} />
                <Route path="/detalleBiciusuario/:userId" element={<CyclistDetail />} />
                <Route path="/detalleBicicleta" element={<BicycleDetail />} />
                <Route path="/crearBicicleta" element={<BicycleCreate />} />
                <Route path="/editarBicicleta" element={<BicycleEdit />} />

                <Route path="/recomendaciones" element={<HomeRecommendations />} />
            </Routes>
        </View>
    );
}

export default Main;