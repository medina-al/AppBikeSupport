//React Native
import { Text, StyleSheet } from "react-native";
import theme from "./styles/theme"


export default function StyledTexts({ children, style, color, fontSize, fontWeight, alignSelf, ...otherProps }) {
    //Custom styles
    const textStyles = {
        ...style
    };
    if (color && theme.colors[color]) {
        textStyles.color = theme.colors[color];
    }
    if (fontSize && theme.fontSizes[fontSize]) {
        textStyles.fontSize = theme.fontSizes[fontSize];
    }
    if (fontWeight && theme.fontWeights[fontWeight]) {
        textStyles.fontWeight = theme.fontWeights[fontWeight];
    }
    if (alignSelf) {
        textStyles.alignSelf = alignSelf;
    }
    const styles = StyleSheet.create({
        textStyles: {
            ...textStyles
        }
    });

    return (
        <Text style={styles.textStyles} {...otherProps}>
            {children}
        </Text>
    )
};