import { HStack, VStack, Box, Button } from 'native-base';
import {useState} from 'react';
import { Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateTranslationScreen = ({route, navigation}) => {
    let article = route?.params?.article;
    let selection = route?.params?.selection;
    if(!article.content){
        article = article.route.params
    }


    const [translationText, setTranslationText] = useState(null);
    /*if(!article || !selection){
        console.log("NOT DEFINED ARITCLE OR SELECTION")
        article = route.route.params
    }*/

    const createTranslation = async () => {
        const userId = await AsyncStorage.getItem("user");
        const query = `/articles/${article.id}/translation`
        console.log(query)
        console.log(translationText);
        await axios.post(query, {start_char_index: selection.start, end_char_index: selection.end, content: translationText, author_id: userId})
        navigation.goBack();
    }

    const handleTextChange = (text) => {  
        setTranslationText(text);
    }

    const checkOverlappingTranslation = async (start, end) => {
        const userId = await AsyncStorage.getItem("user");
        const query = `/articles/${article.id}/translation/${userId}`;
        const response = await axios.get(query);
        if(!response) return false;
        for(let translation of response.data){
            if(translation.start_char_index < start && translation.end_char_index > start){
                console.log("overlapping translation found");
                return true;
            }
            if(translation.start_char_index < end && translation.end_char_index > end){
                console.log("overlapping translation found");
                return true;
            }
        }
        console.log("conflict check response", response.data);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
        >
        <ScrollView contentContainerStyle={styles.container}>
            <VStack style={styles.container}>
                <Box style={styles.textContainer}>
                    <Text style={styles.text}>
                        <Text style={{fontWeight: 'bold'}}>Translating text:</Text>
                        {"\n"}
                        <Text>{article.content.slice(selection.start, selection.end)}</Text>
                    </Text>
                </Box>
                <Box style={styles.inputContainer}>
                    <TextInput placeholder='Translation'
                        placeholderTextColor={'grey'}
                        editable={true}
                        style={styles.textInput}
                        multiline
                        onChangeText={(newText) => {handleTextChange(newText)}}
                    />
                </Box>
                <Box safeArea={10}>
                    <Button onPress={createTranslation}>Create translation</Button>
                </Box>
            </VStack>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
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
        margin: 20,
        textAlign: 'left',
    },
    inputContainer: {
        width: '80%' // Adjust the width as needed
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        minHeight: 40, // Adjust the height as needed
        fontSize: 16 // Adjust the font size as needed
    }
});

export default CreateTranslationScreen;