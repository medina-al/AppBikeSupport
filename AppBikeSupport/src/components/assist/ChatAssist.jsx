//React
import { useContext, useCallback, useState, useLayoutEffect, useEffect } from "react";
//React Native
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { useParams } from "react-router-native";
import { GiftedChat, Send } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
import { database } from "../../../config/firebase";
//Custom Components
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
import StyledTexts from "../../common/StyledTexts";
import StyledButtons from "../../common/StyledButtons";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { getAssist } from "../../services/assist";
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        width: "100%",
    },
});

const ChatAssist = () => {
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const { assistId } = useParams();
    const [assist, setAssist] = useState();

    //Service function
    const getAssistService = async (userId, userType) => {
        const response = await getAssist(userId, userType, assistId);
        if (response.success) {
            setAssist(response.data[0]);
        }
    }

    useEffect(() => {
        getAssistService(userInfo.id, userInfo.type);
    }, []);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats' + assistId);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log('querySnapshot unsusbscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
        });
        return unsubscribe;
    }, [messages]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );
        // setMessages([...messages, ...messages]);
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats' + assistId), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    return (
        <GeneralContainer navigation={true} title="Chat asistencia" icon="support-agent" loading={loading} containerStyles={{padding: 0}}>
            {/*<ScrollView style={styles.scrollView}></ScrollView>*/}
            <View style={styles.chatContainer}>
                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={false}
                    showUserAvatar={true}
                    onSend={messages => onSend(messages)}
                    messagesContainerStyle={{
                        backgroundColor: theme.colors.blackTransparent20
                    }}
                    textInputStyle={{
                        backgroundColor: theme.colors.whiteTransparent10,
                        borderRadius: 20,
                    }}
                    user={{
                        _id: userInfo.mail,
                        avatar: apiBaseUrl + userInfo.image_url
                    }}
                    renderSend={(props) => (
                        <Pressable
                            style={{
                                backgroundColor: theme.colors.orange, // Cambia el color de fondo según tus preferencias
                                borderRadius: 20,
                                margin: 3,
                                padding: 10,
                            }}
                            onPress={() => {
                                props.onSend({ text: props.text }, true);
                            }}>
                            <StyledTexts color={"white"}>
                                Enviar
                            </StyledTexts>
                        </Pressable>)}
                    placeholder={"Escribe un mensaje"}
                />
            </View>
        </GeneralContainer>
    );
}

export default ChatAssist;