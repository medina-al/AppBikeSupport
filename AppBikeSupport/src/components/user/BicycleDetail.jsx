//React
import { useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, FlatList, Image, Pressable } from 'react-native';
import { useLocation, useParams } from "react-router-native";
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Custom styles
import theme from "../../common/styles/theme";

//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    bikeCardHeader: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 10,
        backgroundColor: theme.colors.blackTransparent50
    },
    bikeCard: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        padding: 5,
        backgroundColor: theme.colors.blackTransparent30
    },
    image: {
        borderRadius: 100,
        width: 150,
        height: 150
    },
    bikeImage: {
        margin: 2,
        borderRadius: 10,
        width: 150,
        height: 150,
        marginBottom: 5
    },
    divider: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 0.5,
        borderColor: theme.colors.black,
        width: "100%"
    },
    bikeFeature: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        padding: 3
    }
});

const BicycleDetail = () => {
    const location = useLocation();
    const [bike, setBike] = useState(location.state);

    return (
        <GeneralContainer navigation={true} title="Detalle bicicleta" icon="pedal-bike">
            <ScrollView style={styles.scrollView} >
                <View style={styles.bikeCardHeader}>
                    <StyledTexts fontSize={"biggest"} fontWeight={"bolder"} color={"white"}>
                        {bike.brand} {bike.line} {bike.model}
                    </StyledTexts>
                    <StyledTexts fontSize={"smaller"} color={"white"} style={{ textAlign: "justify" }}>
                        {bike.description}
                    </StyledTexts>
                </View>
                {bike.BicycleImages.length > 0 && (
                    <>
                        <View style={[styles.bikeCard, { justifyContent: "center", alignItems: "center" }]}>
                            <FlatList
                                data={bike.BicycleImages}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <>
                                        <Image source={{ uri: apiBaseUrl + item.url }} style={styles.bikeImage} />
                                    </>
                                )}
                            />
                            <View style={styles.divider} />
                        </View>
                    </>
                )}
                <View style={[styles.bikeCard, { paddingHorizontal: 40, paddingBottom: 20 }]}>
                    <StyledTexts fontSize={"biggest"} fontWeight={"bold"} color={"white"}>
                        Características bici
                    </StyledTexts>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Tipo:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.Type.firstValue}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Material:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.Material.firstValue}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Grupo delantero:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.front_groupset}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Grupo trasero:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.back_groupset}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Frenos:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.brakes}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Tipo de frenos:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.Brakes.firstValue}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Ruedas:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.wheels}
                        </StyledTexts>
                    </View>
                    <View style={styles.bikeFeature}>
                        <StyledTexts fontSize={"normal"} fontWeight={"bold"} color={"white"}>
                            Tamaño ruedas:
                        </StyledTexts>
                        <StyledTexts fontSize={"normal"} color={"white"} style={{ textAlign: "right" }}>
                            {bike?.wheel_size}
                        </StyledTexts>
                    </View>
                </View>
            </ScrollView>
        </GeneralContainer>
    );
}

export default BicycleDetail;