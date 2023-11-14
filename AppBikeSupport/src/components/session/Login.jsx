//React and React Native
import { useState, useContext } from "react";
import { StyleSheet, Alert, Image } from "react-native";
import { useNavigate } from "react-router-native";
//Custom components
import StyledTexts from "../../common/StyledTexts";
import StyledInputs from "../../common/StyledInputs";
import StyledButtons from "../../common/StyledButtons";
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { validateStringLength } from "../../utils/stringValidations";
//Services
import { login } from "../../services/sessions";
//
import loginImage from '../../../assets/loginImage.png';

const styles = StyleSheet.create({
    input: {
        width: "100%"
    },
    title: {
        marginBottom: 15
    }
});

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext)
    //Form values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //Error variables
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleLogin = async () => {
        //Validations
        if (username == '') {
            setErrorUsername("Este campo es obligatorio");
            return;
        } else {
            setErrorUsername(null);
        }
        if (password == '') {
            setErrorPassword("Este campo es obligatorio");
            return;
        } else {
            setErrorPassword(null);
        }
        if (validateStringLength("La contraseña", password, 8, "min") != "OK") {
            setErrorPassword(validateStringLength("La contraseña", password, 8, "min"));
            return;
        } else {
            setErrorPassword(null);
        }
        const body = {
            username,
            password
        }
        const response = await login(body);
        if (response.success) {
            loginUser(response.data);
        } else {
            let errorMessage;
            if(response.response.status==500){
                errorMessage='Hubo un error, intenta nuevamente por favor.';
            }else{
                errorMessage='Hubo un error: '+response.response.data.data;
            }
            Alert.alert(
                'Error',
                errorMessage,
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/')
                        },
                    },
                ]
            );
        }
    };
    return (
        <GeneralContainer containerStyles={{justifyContent: "flex-start", paddingTop: 50}}>
            <Image source={loginImage} style={{ width: "80%", height: 200, marginBottom: 50 }} />
            <StyledTexts
                color={"white"}
                fontSize={"bigger"}
                fontWeight={"bolder"}
                style={styles.title}>
                Inicia sesión
            </StyledTexts>
            <StyledTexts
                color={"white"}
                alignSelf={"flex-start"}>
                Usuario o correo electrónico
            </StyledTexts>
            <StyledInputs
                value={username}
                placeholder={"Digita tu usuario o correo electrónico"}
                style={styles.input}
                onChangeText={(username) => { setUsername(username); setErrorUsername(null); }}
                error={errorUsername}
            />
            <StyledTexts
                color={"white"}
                alignSelf={"flex-start"}>
                Contraseña
            </StyledTexts>
            <StyledInputs
                value={password}
                placeholder={"Digita tu contraseña"}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(password) => { setPassword(password); setErrorPassword(null); }}
                error={errorPassword}
            />
            <StyledButtons backgroundColor={"orange"} onPress={handleLogin}>
                <StyledTexts
                    color={"white"}
                    alignSelf={"center"}
                    fontSize={"bigger"}>
                    Iniciar Sesión
                </StyledTexts>
            </StyledButtons>
            <StyledButtons backgroundColor={"white"} onPress={() => { navigate('/crearCuenta') }}>
                <StyledTexts
                    color={"orange"}
                    alignSelf={"center"}
                    fontSize={"bigger"}>
                    Crea tu cuenta
                </StyledTexts>
            </StyledButtons>
        </GeneralContainer >
    );
}

export default Login;
