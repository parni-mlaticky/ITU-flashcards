import { Text, Box, HStack, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'native-base'
import { useEffect, useState } from 'react';
import axios from 'axios';

const CommunityTranslationScreen = ({navigation, route}) => {
    const { selection, article } = route.params;
    const selectedContent = article.content.slice(selection.start, selection.end);

    const [availableTranslations, setAvailableTranslations] = useState(null);

    const fetchAvailableTranslations = async () => {
        const query = `/articles/${article.id}/translation/position/`
        const available = []
        const response = await axios.get(query)
        for(let translation of response.data){
            if(translation.start_char_index === selection.start && translation.end_char_index === selection.end){
                const authorResponse = await axios.get(`/users/name/${translation.author_id}`);
                console.log("author name", authorResponse.data.username);
                translation.authorName = authorResponse.data.username;
                available.push(translation);
            }
        }
        setAvailableTranslations(available);
    }

    useEffect(() => {  
        fetchAvailableTranslations();
    }, [route])

    const renderTranslations = () => {
        if(availableTranslations === null) return <Text>Loading translations...</Text>
        if(availableTranslations.length === 0) return <Text>No translations available</Text>
        return (availableTranslations.map((translation, index) => {
            return (
                <Box
                    key={index}
                >
                    <HStack marginLeft={10} style={styles.hStack}>
                        <Box style={styles.textContainer}>
                            <Text style={styles.text}>Author: {translation.authorName}</Text>
                            <Text style={styles.text}>Translation: {translation.content}</Text>
                        </Box>
                        <Button onPress={() => {navigation.navigate("DeckSelect", {back: translation.content, front: selectedContent})}} marginLeft={10} height={10}>Add to deck</Button>
                    </HStack>
                </Box>
            );
        }))
    }

    return (
        <ScrollView alignContent={"center"}>
            <Text alignItems={"center"} alignSelf={"center"} fontSize={20}>Community translations for: {"\n"}
                <Text style={{color: "blue", alignSelf: "center"}}>
                    {selectedContent}
                </Text>
            </Text>
            {renderTranslations()}
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        margin:10
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginBottom: 20
    },
    text: {
        marginLeft:20,
        marginBottom: 3,
        textAlign: 'left',
    },
    inputContainer: {
        width: '80%'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        minHeight: 90,
        fontSize: 16
    },
    highlighted: {
        backgroundColor: 'lightblue'
    },
});


export default CommunityTranslationScreen;