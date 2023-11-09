//React Native
import { TextInput, StyleSheet } from "react-native";
//Custom components
import StyledTexts from "./StyledTexts";

export default function StyledInputs({ type, placeholder, secureTextEntry, value, style, ...otherProps }) {
    //Custom styles
    const styles = StyleSheet.create({
        inputStyles: {
            backgroundColor: "white",
            opacity: 0.5,
            margin: 10,
            padding: 5,
            borderRadius: 10,
            borderWidth: (otherProps.error) ? 3 : 0,
            borderColor: (otherProps.error) ? "red" : null,
            shadowColor: (otherProps.error) ? "red" : null,
            shadowOffset: (otherProps.error) ? {
                width: 0,
                height: 0,
            } : null,
            shadowOpacity: (otherProps.error) ? 20 : null,
            shadowRadius: (otherProps.error) ? 10 : null,
            ...style
        }
    });
    return (
        <>
            <TextInput
                style={styles.inputStyles}
                placeholder={placeholder}
                value={value}
                secureTextEntry={secureTextEntry}
                {...otherProps}
            />
            {otherProps.error && (
                <StyledTexts
                    color={"red"}
                    fontSize={"small"}
                    style={styles.title}
                    alignSelf={"flex-start"}>
                    {otherProps.error}
                </StyledTexts>
            )}
        </>
    )
};