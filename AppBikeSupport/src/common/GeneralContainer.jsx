//React & React Native
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, View, Pressable } from "react-native";
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
//Custom components
import StyledTexts from "./StyledTexts";
//Custom styles
import theme from "./styles/theme";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    topBar: {
        backgroundColor: theme.colors.white,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.red,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomBar: {
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.red,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainerActive: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.orange
    },
    iconContainerInactive: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.white
    },
});

//Background
const backgroundColors = [theme.colors.orange, theme.colors.lightOrange]; // Colores del degradado (de naranja a blanco)
const locations = [0.4, 1];

const GeneralContainer = ({ children, navigation, title, icon, containerStyles, loading }) => {
    const navigate = useNavigate();
    return (
        <>
            {navigation ? (
                <View style={styles.topBar}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name={icon} size={40} color={theme.colors.orange} />
                        <StyledTexts fontSize={"bigger"} color={"orange"} style={{ paddingStart: 10 }}>
                            {title}
                        </StyledTexts>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable onPress={() => { navigate('/perfil') }} style={{ marginHorizontal: 5 }}>
                            <Icon name="account-circle" size={40} color={theme.colors.orange} />
                        </Pressable>
                        <Pressable onPress={() => { navigate('/notificaciones') }} style={{ marginHorizontal: 5 }}>
                            <Icon name="circle-notifications" size={40} color={theme.colors.orange} />
                        </Pressable>
                    </View>
                </View>
            ) : null}
            <LinearGradient colors={backgroundColors} locations={locations} style={[styles.container, containerStyles]}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.white} />
                ) : (
                    children
                )}
            </LinearGradient>
            {navigation ? (
                <View style={styles.bottomBar}>
                    <View style={title == "Asistencias" ? styles.iconContainerActive : styles.iconContainerInactive}>
                        <Pressable onPress={() => { navigate('/asistencias') }}>
                            <Icon name={"construction"} size={50} color={title == "Asistencias" ? theme.colors.white : theme.colors.orange} />
                        </Pressable>
                    </View>
                    <View style={title == "Biciusuarios" ? styles.iconContainerActive : styles.iconContainerInactive}>
                        <Pressable onPress={() => { navigate('/biciusuarios') }}>
                            <Icon name={"group"} size={50} color={title == "Biciusuarios" ? theme.colors.white : theme.colors.orange} />
                        </Pressable>
                    </View>
                    <View style={title.startsWith("Inicio") ? styles.iconContainerActive : styles.iconContainerInactive}>
                        <Pressable onPress={() => { navigate('/') }}>
                            <Icon name={"home-filled"} size={50} color={title.startsWith("Inicio") ? theme.colors.white : theme.colors.orange} />
                        </Pressable>
                    </View>
                    <View style={title == "Aliados" ? styles.iconContainerActive : styles.iconContainerInactive}>
                        <Pressable onPress={() => { navigate('/aliados') }}>
                            <Icon name={"store"} size={50} color={title == "Aliados" ? theme.colors.white : theme.colors.orange} />
                        </Pressable>
                    </View>
                    <View style={title == "Recomendaciones" ? styles.iconContainerActive : styles.iconContainerInactive}>
                        <Pressable onPress={() => { navigate('/recomendaciones') }}>
                            <Icon name={"subscriptions"} size={50} color={title == "Recomendaciones" ? theme.colors.white : theme.colors.orange} />
                        </Pressable>
                    </View>
                </View>
            ) : null}
        </>
    )
}

export default GeneralContainer;