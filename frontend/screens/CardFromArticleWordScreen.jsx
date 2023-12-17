import {useEffect, useState} from 'react';
import { Box, Text, HStack, Button } from 'native-base';
import axios from 'axios';
import { TouchableHighlight, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';

const CardFromArticleWordScreen = ({ navigation, route } ) => {
    const [availableTranslations, setAvailableTranslations] = useState(null);
    const [selectedTranslation, setSelectedTranslation] = useState(null);
    const [selectedCustomTranslation, setSelectedCustomTranslation] = useState(false);
    const [customTranslation, setCustomTranslation] = useState("");

    useEffect(() => {
        fetchAvailableTranslations();
    }, [route])

    const fetchAvailableTranslations = async () => {
        const query = `/articles/${article.id}/translation`
        const translationsForSelection = []
        const response = await axios.get(query)
        if(!response.data?.length) return setAvailableTranslations([]);
        for(let translation of response.data){
            const allFromUser = await axios.get(`/articles/${article.id}/translation/${translation.author_id}`)
            for(let userTranslation of allFromUser.data){
                if(userTranslation.start_char_index === selection.start && userTranslation.end_char_index === selection.end){
                    const authorName = await axios.get(`/users/name/${userTranslation.author_id}`)
                        translationsForSelection.push({authorName: authorName.data.username, content: userTranslation.content});
                }
            }
        }
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
                        setSelectedCustomTranslation(false);
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

    const selectedContent = article.content.slice(selection.start, selection.end);

    return (
        <Box margin={10}>
        <Text style={styles.text}>Add selection to deck:{"\n"}
            <Text bold> {selectedContent}</Text>
        </Text>

        { renderTranslations() }
        <TouchableHighlight
                    key={1000}
                    style={[
                        styles.touchableHighlight,
                        selectedCustomTranslation && styles.highlighted
                    ]}
                    onPress={() => {
                        setSelectedCustomTranslation(true);
                        setSelectedTranslation(null);
                        setCustomTranslation("");
                    }}
                    underlayColor="transparent"
                >
                    <HStack style={styles.hStack}>
                        <Box style={styles.textContainer}>
                            <Text style={styles.text}>Provide own translation</Text>
                        </Box>
                    </HStack>
        </TouchableHighlight>
        {selectedCustomTranslation && 
        <TextInput placeholder="Custom translation" placeholderTextColor="grey" onChangeText={(newText) => {setCustomTranslation(newText)}} style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 5,
            padding: 10,
            minHeight: 40,
            fontSize: 16,
            marginTop: 10
            }}>
        </TextInput>}
        {(selectedTranslation !== null || selectedCustomTranslation && customTranslation !== "") && <Button marginTop={5} onPress={() =>{navigation.navigate("DeckSelect", {front: selectedContent, back: customTranslation !== "" ? customTranslation : availableTranslations[selectedTranslation].content})}}>Choose translation</Button>}
        
        </Box>
    )
}

const styles = StyleSheet.create({
    touchableHighlight: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    highlighted: {
        backgroundColor: 'lightblue',
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