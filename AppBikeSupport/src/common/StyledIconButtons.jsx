//React Native
import { StyleSheet, Pressable, View } from "react-native";
import theme from "./styles/theme";
import StyledTexts from "./StyledTexts";

export default function StyledIconButtons({ children, buttonSize, backgroundColor, title, text, textColor, style, ...otherProps }) {
    //Custom styles
    const styles = StyleSheet.create({
        buttonStyles: {
            backgroundColor: (backgroundColor ? backgroundColor : theme.colors.white),
            margin: 5,
            borderRadius: 100,
            textAlign: "center",
            borderWidth: 1,
            borderColor: theme.colors.orange,
            width: (buttonSize) ? buttonSize : 40,
            height: (buttonSize) ? buttonSize : 40,
            justifycontent: "center",
            alignContent: "center",
            ...style
        },
        containerStyles: {
            flex: 1,
            justifyContent: "center", // Centra verticalmente
            alignItems: "center", // Centra horizontalmente
        }
    });
    return (
        <View style={styles.containerStyles}>
            <Pressable
                style={styles.buttonStyles}
                {...otherProps}
            >
                <View style={styles.containerStyles}>
                    {children}
                </View>
            </Pressable>
            {
                text &&
                <StyledTexts color={textColor}>
                    {text}
                </StyledTexts>
            }
        </View>
    )
};