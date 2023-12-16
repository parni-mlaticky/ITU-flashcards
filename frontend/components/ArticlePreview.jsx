import { Box, Text, Image } from "native-base";
import { TextInput, TouchableWithoutFeedback, Keyboard, Touchable, TouchableHighlight } from "react-native";
import SelectionOverlay from "./SelectionOverlay";
import React, { useState } from "react";

const ArticlePreview = ({ article, previewSelectHandler, openArticleCallback, unselectCallback }) => {
    const [selection, setSelection] = useState(null);

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

    return (        
        <Box  flexDirection="row" alignItems="center">
            <Box padding="5">
                {article.cover_image_link ? (
                <TouchableHighlight onPress={openArticle}>
                    <Image on
                        style={{ width: 100, height: 100 }} 
                        source={{ uri: article.cover_image_link }} 
                        alt={article.heading}
                    />  
                </TouchableHighlight>
                ) : (
                    <Text>No image available</Text>
                )}
            </Box>
            <Box flex={1}>
                <TextInput value={article.heading} editable={false} padding={0} margin={0} onSelectionChange={handleSelectionChange} multiline></TextInput>
            </Box>
        </Box>
    );
}

export default ArticlePreview;