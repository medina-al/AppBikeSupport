//React Native
import { StyleSheet, Pressable } from "react-native";
import theme from "./styles/theme";

export default function StyledButtons({ backgroundColor, borderColor, title, style, ...otherProps }) {
    //Custom styles
    const styles = StyleSheet.create({
        buttonStyles: {
            backgroundColor: (backgroundColor == "orange" ? theme.colors.orange : theme.colors.white),
            margin: 15,
            padding: 10,
            borderRadius: 10,
            width: "100%",
            textAlign: "center",
            borderWidth: 1,
            borderColor: (borderColor)?borderColor:theme.colors.white,
            ...style
        }
    });
    return (
        <Pressable
            style={styles.buttonStyles}
            {...otherProps}
        />
    )
};