//React and React Native
import { useState, useContext } from "react";
import { StyleSheet, ScrollView, Alert, Image, View } from "react-native";
import { useNavigate } from "react-router-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
//Custom components
import StyledTexts from "../../../common/StyledTexts";
import StyledInputs from "../../../common/StyledInputs";
import StyledButtons from "../../../common/StyledButtons";
import GeneralContainer from "../../../common/GeneralContainer";
import { AuthContext } from "../../../contexts/AuthContext";
//Custom functions
import { validateStringLength } from "../../../utils/stringValidations";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { editAccount } from "../../../services/users";
//Custom styles
import theme from "../../../common/styles/theme";
const styles = StyleSheet.create({
    input: {
        width: "100%"
    },
    title: {
        marginBottom: 15
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white'
    },
    picker: {
        backgroundColor: theme.colors.whiteTransparent50,
        padding: 1,
        borderRadius: 30,
        width: "100%"

    },
});

const AccountEdit = () => {
    const { updateUser, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    //Form values
    const [username, setUsername] = useState(userInfo.username);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [names, setNames] = useState(userInfo.names);
    const [lastnames, setLastnames] = useState(userInfo.lastnames);
    const [bio, setBio] = useState(userInfo.bio);
    const [mobile, setMobile] = useState(userInfo.mobile);
    const [image, setImage] = useState(apiBaseUrl + userInfo.image_url);
    const [publicAccount, setPublicAccount] = useState((userInfo.public == true) ? 1 : 0);
    const [status, setStatus] = useState(userInfo.status);
    //Error variables
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('');
    const [errorStatus, setErrorStatus] = useState('');
    const [errorNames, setErrorNames] = useState('');
    const [errorLastnames, setErrorLastnames] = useState('');
    const [errorPublicAccount, setErrorPublicAccount] = useState('');

    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            setImage(selectedImage.uri);
        }
    };

    const handleSubmit = async () => {
        //Validations
        if (username == '') {
            setErrorUsername("Este campo es obligatorio");
            return;
        } else {
            setErrorUsername(null);
        }
        if (names == '') {
            setErrorNames("Este campo es obligatorio");
            return;
        } else {
            setErrorNames(null);
        }
        if (lastnames == '') {
            setErrorLastnames("Este campo es obligatorio");
            return;
        } else {
            setErrorLastnames(null);
        }
        if (publicAccount == 2) {
            setErrorPublicAccount("Este campo es obligatorio");
            return;
        } else {
            setErrorPublicAccount(null);
        }
        if (status == 2) {
            setErrorStatus("Este campo es obligatorio");
            return;
        } else {
            setErrorStatus(null);
        }
        if (password != '') {
            if (passwordConfirm == '') {
                setErrorPasswordConfirm("Este campo es obligatorio");
                return;
            } else {
                setErrorPasswordConfirm(null);
            }
            if (passwordConfirm != password) {
                setErrorPassword("Las contraseñas no coinciden.");
                setErrorPasswordConfirm("Las contraseñas no coinciden.");
                return;
            } else {
                setErrorPasswordConfirm(null);
            }
            if (validateStringLength("La contraseña", password, 8, "min") != "OK") {
                setErrorPassword(validateStringLength("La contraseña", password, 8, "min"));
                return;
            } else {
                setErrorPassword(null);
            }
        }
        //Send request
        const body = new FormData();
        //Handle image
        if (image) {
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const localUri = image;
            const filename = localUri.split('/').pop();
            body.append('profile', {
                uri: localUri,
                name: filename,
                type: `image/${fileType}`,
            });
        }

        body.append("username", username);
        body.append("password", password);
        body.append("names", names);
        body.append("lastnames", lastnames);
        body.append("bio", bio);
        body.append("public", publicAccount);
        body.append("status", status);
        body.append("mobile", mobile);
        setLoading(true);
        const response = await editAccount(userInfo.id,body);
        console.log(response);
        if (response.success) {
            setLoading(false);
            updateUser(response.data)
            Alert.alert(
                'Éxito',
                'Cuenta actualizada exitosamente',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            navigate('/perfil')
                        },
                    },
                ]
            );
        } else {
            setLoading(false);
            let errorMessage;
            if (response.response.status == 500) {
                errorMessage = 'Hubo un error, intenta nuevamente por favor.';
            } else {
                errorMessage = 'Hubo un error: ' + response.response.data.data;
            }
            Alert.alert(
                'Error',
                errorMessage,
                [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            //navigate('/')
                        },
                    },
                ]
            );
        }
    };

    const validateStatus = (status) => {
        if (status == 'INACTIVO') {
            Alert.alert('Alerta', 'Esto cerrará tu sesión e inactivará tu cuenta');
        }
    }
    return (
        <GeneralContainer navigation={true} title="Editar perfil" icon="person" loading={loading}>
            <ScrollView contentContainerStyle={styles.scrollContent} style={{ width: "100%" }}>
                {image && (
                    <Image source={{ uri: image }} style={styles.image} />
                )}
                <StyledButtons
                    backgroundColor={"white"}
                    onPress={pickImage}
                    style={{ width: "40%", padding: 1 }}
                >
                    <StyledTexts
                        color={"orange"}
                        alignSelf={"center"}
                        fontSize={"bigger"}>
                        Cambiar imagen
                    </StyledTexts>
                </StyledButtons>
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Nombre de usuario personalizado *
                </StyledTexts>
                <StyledInputs
                    value={username}
                    placeholder={"Digita tu nombre de usuario personalizado"}
                    style={styles.input}
                    onChangeText={(username) => { setUsername(username); setErrorUsername(null); }}
                    error={errorUsername}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Nombre(s) *
                </StyledTexts>
                <StyledInputs
                    value={names}
                    placeholder={"Digita tu(s) nombre(s)"}
                    style={styles.input}
                    onChangeText={(names) => { setNames(names); setErrorNames(null); }}
                    error={errorNames}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Apellido(s) *
                </StyledTexts>
                <StyledInputs
                    value={lastnames}
                    placeholder={"Digita tu(s) apellido(s)"}
                    style={styles.input}
                    onChangeText={(lastnames) => { setLastnames(lastnames); setErrorLastnames(null); }}
                    error={errorLastnames}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Número de celular
                </StyledTexts>
                <StyledInputs
                    value={mobile}
                    placeholder={"Digita tu número de celular"}
                    style={styles.input}
                    onChangeText={(mobile) => { setMobile(mobile); }}
                    keyboardType="phone-pad"
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Bio
                </StyledTexts>
                <StyledInputs
                    value={bio}
                    placeholder={"Cuenta algo sobre ti"}
                    style={styles.input}
                    onChangeText={(bio) => { setBio(bio); }}
                    multiline
                    rows={4}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Tipo de perfil *
                </StyledTexts>
                <View style={{ borderRadius: 10, width: "100%", overflow: "hidden", margin: 10 }}>
                    <Picker
                        selectedValue={publicAccount}
                        onValueChange={(itemValue) => { setPublicAccount(itemValue); }}
                        style={styles.picker}
                    >
                        <Picker.Item label={"Seleccionar"} value={2} color="grey" />
                        <Picker.Item label={"PÚBLICO"} value={1} />
                        <Picker.Item label={"PRIVADO"} value={0} />
                    </Picker>
                </View>
                {errorPublicAccount && errorPublicAccount!=null && (
                    <StyledTexts
                        color={"red"}
                        fontSize={"small"}
                        alignSelf={"flex-start"}>
                        {errorPublicAccount}
                    </StyledTexts>
                )}
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Estado de cuenta *
                </StyledTexts>
                <View style={{ borderRadius: 10, width: "100%", overflow: "hidden", margin: 10 }}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue) => { setStatus(itemValue); validateStatus(itemValue) }}
                        style={styles.picker}
                    >
                        <Picker.Item label={"Seleccionar"} value={2} color="grey" />
                        <Picker.Item label={"ACTIVO"} value={"ACTIVO"} />
                        <Picker.Item label={"INACTIVO"} value={"INACTIVO"} style={{ backgroundColor: "red" }} />
                    </Picker>
                </View>
                {errorStatus && errorStatus!=null && (
                    <StyledTexts
                        color={"red"}
                        fontSize={"small"}
                        alignSelf={"flex-start"}>
                        {errorStatus}
                    </StyledTexts>
                )}
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Contraseña *
                </StyledTexts>
                <StyledInputs
                    value={password}
                    placeholder={"Digita tu contraseña"}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(password) => { setPassword(password); setErrorPassword(null); }}
                    error={errorPassword}
                />
                <StyledTexts
                    color={"white"}
                    alignSelf={"flex-start"}>
                    Confirmar contraseña *
                </StyledTexts>
                <StyledInputs
                    value={passwordConfirm}
                    placeholder={"Digita tu contraseña"}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(passwordConfirm) => { setPasswordConfirm(passwordConfirm); setErrorPasswordConfirm(null); }}
                    error={errorPasswordConfirm}
                />
                <StyledButtons backgroundColor={"white"} onPress={handleSubmit}>
                    <StyledTexts
                        color={"orange"}
                        alignSelf={"center"}
                        fontSize={"bigger"}>
                        Actualizar información
                    </StyledTexts>
                </StyledButtons>
            </ScrollView>
        </GeneralContainer >
    );
}

export default AccountEdit;
