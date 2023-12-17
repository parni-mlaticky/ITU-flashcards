import { Box, Text, Image } from "native-base";
import { TextInput, TouchableWithoutFeedback, Keyboard, Touchable, TouchableHighlight } from "react-native";
import SelectionOverlay from "./SelectionOverlay";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ArticlePreview = ({ article, previewSelectHandler, openArticleCallback, unselectCallback, navigation }) => {
    const [selection, setSelection] = useState(null);
    const [avgRating, setAvgRating] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        if(start !== end) {
            setSelection({start, end});
        }
        else {
            setSelection(null);
        }
        previewSelectHandler(event.nativeEvent.selection, article);
    }

    const unselect = () => {
        unselectCallback();
    }

    const openArticle = () => {
        openArticleCallback(article);
    }

    const getAvgRating = async () => {
        const ratings = await axios.get(`/articles/${article.id}/rating`)
        setAvgRating(ratings?.data?.avg);
    }

    useEffect(() => {
        getAvgRating();
    }, [article])

    const getRatingColor = () => {
        if(!avgRating) return "black";
        if(avgRating <= 1) return "lightgreen";
        if(avgRating <= 2) return "limegreen";
        if(avgRating <= 3) return "#DB8000";
        if(avgRating <= 4) return "orange";
        return "red";
    }

    const getRatingColor2 = () => {
        if (!avgRating) return "black";
      
        // Define the hue for green and red (in HSL)
        const greenHue = 120; // Hue for green
        const redHue = 0; // Hue for red
      
        // Calculate the hue based on the rating
        // If rating is 1 (green), the hue is greenHue (120)
        // If rating is 5 (red), the hue is redHue (0)
        const hue = greenHue - ((avgRating - 1) / (5 - 1)) * (greenHue - redHue);
      
        return `hsl(${hue}, 100%, 50%)`; // Full saturation and 50% lightness
      };

    return (        
        <Box  flexDirection="row" alignItems="center">
            <Box padding="5">
                {article.cover_image_link ? (
                <TouchableHighlight onPress={openArticle}>
                    <Image on
                        style={{ width: 150, height: 100 }} 
                        source={{ uri: article.cover_image_link }} 
                        alt={article.heading}
                    />  
                </TouchableHighlight>
                ) : (
                    <Text>No image available</Text>
                )}
            </Box>
            <Box flex={1}>
                <TextInput scrollEnable={false} value={article.heading} editable={false} padding={0} margin={0} onSelectionChange={() => {}} multiline></TextInput>
                <Text style={{color:getRatingColor(),}}>{"Difficulty: " + (avgRating ? Number(avgRating).toPrecision(2) : "No ratings yet")}</Text>
            </Box>
        </Box>
    );
}

export default ArticlePreview;