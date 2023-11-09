//React
import { useContext, useEffect } from "react";
//React Native
import { useNavigate } from "react-router-native";
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import StyledButtons from "../../common/StyledButtons";
import { AuthContext } from "../../contexts/AuthContext";
import GeneralContainer from "../../common/GeneralContainer";
//Services
import { getAssist } from "../../services/assist";

const HomeAssistance = () => {
    const { userInfo, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(userInfo);
    }, []);
    return (
        <GeneralContainer navigation={true} title="Perfil" icon="person">
           <StyledButtons backgroundColor={"orange"} onPress={()=>{logoutUser(); navigate('/')}}>
                <StyledTexts
                    color={"white"}
                    alignSelf={"center"}
                    fontSize={"bigger"}>
                    Cerrar Sesión
                </StyledTexts>
            </StyledButtons>
        </GeneralContainer>
    );
}

export default HomeAssistance;