//React
import { useEffect, useState } from "react";
//React Native
import { ScrollView, StyleSheet, View, FlatList, Image, RefreshControl, Dimensions } from 'react-native';
import { useNavigate } from "react-router-native";
import YoutubePlayer from "react-native-youtube-iframe";
//Custom Components
import StyledTexts from "../../common/StyledTexts";
import GeneralContainer from "../../common/GeneralContainer";
//Custom functions
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;
//Services
import { getRecommendations } from "../../services/recommendations";
//Custom styles 
import theme from "../../common/styles/theme";

const windowWidth = Dimensions.get("window").width;
//Styles
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: "100%",
    },
    recCardHeader: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        padding: 5,
        backgroundColor: theme.colors.blackTransparent50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    recCard: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        backgroundColor: theme.colors.blackTransparent30
    },
    container: {
        flex: 1,
    },
    image: {
        width: 200,
        aspectRatio: 1,
        margin: 2
    },
});

const HomeRecommendations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState();
    const [refreshing, setRefreshing] = useState(false);

    //Service function
    const getRecommendationsService = async () => {
        setLoading(true);
        const response = await getRecommendations(null, 'ACTIVA');
        if (response.success) {
            console.log(response.data[0].RecommendationMedias);
            setRecommendations(response.data);
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        getRecommendationsService();
    }

    const renderRecommendations = recommendations &&
        recommendations.length > 0 &&
        recommendations.map((rec, index) => {
            return (
                <View key={"ally_" + index} style={{ marginBottom: 20 }}>
                    <View style={styles.recCardHeader}>
                        <View style={{ padding: 10 }}>
                            <StyledTexts fontSize={"bigger"} fontWeight={"bold"} color={"white"}>{rec.title}</StyledTexts>
                        </View>
                    </View>
                    <View style={styles.recCard}>
                        <View style={{ padding: 10 }}>
                            <StyledTexts fontSize={"small"} fontWeight={"bold"} color={"white"} style={{ textAlign: "justify" }}>
                                {rec.description}
                            </StyledTexts>
                        </View>
                    </View>
                    <View style={styles.recCard}>
                        {
                            rec.RecommendationMedias.map((media,index) => {
                                if (media.type == 'video') {
                                    return (
                                        <YoutubePlayer
                                            key={"media_"+index}
                                            height={250}
                                            play={"false"}
                                            videoId={media.url}
                                        />
                                    )
                                }
                            })
                        }
                        <FlatList
                            data={rec.RecommendationMedias}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            renderItem={({ item }) => (
                                <>
                                    <View style={styles.container}>
                                        {(item.type == 'image') && (
                                            <Image
                                                source={{ uri: apiBaseUrl + item.url }}
                                                style={styles.image}
                                            />
                                        )}
                                    </View>
                                </>
                            )}
                        />
                    </View>
                </View>
            )
        });

    useEffect(() => {
        getRecommendationsService();
    }, []);
    return (
        <GeneralContainer navigation={true} title="Recomendaciones" icon="perm-media" loading={loading}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={ // Agregar el componente RefreshControl
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.colors.orange} // Cambia el color de la animación de recarga
                        colors={[theme.colors.white, theme.colors.yellow]} // Cambia los colores de la animación de recarga
                        progressBackgroundColor={theme.colors.orange}
                    />
                }>
                {renderRecommendations}
            </ScrollView>
        </GeneralContainer>
    );
}

export default HomeRecommendations;