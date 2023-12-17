import {useEffect, useState} from 'react';
import { Box, Text, HStack, Button } from 'native-base';
import axios from 'axios';
import { TouchableHighlight } from 'react-native';
import { StyleSheet } from 'react-native';

const CardFromArticleWordScreen = ({ navigation, route } ) => {
    const [availableTranslations, setAvailableTranslations] = useState(null);
    const [selectedTranslation, setSelectedTranslation] = useState(null);

    useEffect(() => {
        fetchAvailableTranslations();
    }, [route])

    const fetchAvailableTranslations = async () => {
        const query = `/articles/${article.id}/translation`
        const translationsForSelection = []
        console.log(query);
        const response = await axios.get(query)
        console.log("available translations", response.data);
        for(let translation of response.data){
            const allFromUser = await axios.get(`/articles/${article.id}/translation/${translation.author_id}`)
            console.log("all from user", allFromUser.data);
            for(let userTranslation of allFromUser.data){
                if(userTranslation.start_char_index === selection.start && userTranslation.end_char_index === selection.end){
                    const authorName = await axios.get(`/users/name/${userTranslation.author_id}`)
                    console.log("author name", authorName.data);
                    console.log("user has translation for this selection");
                        translationsForSelection.push({authorName: authorName.data.username, content: userTranslation.content});
                }
            }
        }
        console.log("translations for selection", translationsForSelection);
        setAvailableTranslations(translationsForSelection);
    }

    const renderTranslations = () => {
        if(availableTranslations === null) return <Text>Loading translations...</Text>
        if(availableTranslations.length === 0) return <Text>No translations available</Text>
        return (availableTranslations.map((translation, index) => {
            return (
                <TouchableHighlight
                    key={index}
                    style={[
                        styles.touchableHighlight,
                        selectedTranslation === index && styles.highlighted
                    ]}
                    onPress={() => {
                        setSelectedTranslation(index);
                        //navigation.navigate("CreateDeck", {word: translation.content});
                    }}
                    underlayColor="transparent"
                >
                    <HStack style={styles.hStack}>
                        <Box style={styles.textContainer}>
                            <Text style={styles.text}>Author: {translation.authorName}</Text>
                            <Text style={styles.text}>Translation: {translation.content}</Text>
                        </Box>
                    </HStack>
                </TouchableHighlight>
            );
        })
        )
    }
    const { article, selection } = route.params;
    console.log("article", article)
    console.log("selection", selection)

    const selectedContent = article.content.slice(selection.start, selection.end);

    return (
        <Box margin={10}>
        <Text style={styles.text}>Add selection to deck:{"\n"}
            <Text bold> {selectedContent}</Text>
        </Text>

        { renderTranslations() }
        {selectedTranslation !== null && <Button marginTop={5} onPress={() =>{navigation.navigate("DeckSelect", {front: selectedContent, back: availableTranslations[selectedTranslation].content})}}>Choose translation</Button>}
        </Box>
    )
}

const styles = StyleSheet.create({
    touchableHighlight: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    highlighted: {
        backgroundColor: 'lightblue', // Highlight color
    },
    textContainer: {
        width: '100%',
        padding: 10,
    },
    text: {
        fontSize: 16,
    },
    hStack: {
        width: '100%',
    },
});

export default CardFromArticleWordScreen;