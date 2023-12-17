/**
 * @file Screen for deleting translations created by the user, shown when user selects "Delete translations" in the article details screen.
 * @author Vladimír Hucovič
 */

import { View, TouchableHighlight } from 'react-native';
import { Box, Button, HStack, ScrollView, Text } from 'native-base';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StyleSheet } from 'react-native';
import { Alert } from 'react-native';

const TranslationDeletionScreen = ({ navigation, route }) => {
    const { article } = route.params;
    console.log("ARTICLE", article)

    const [translationsForUser, setTranslationsForUser] = useState([]);
    const [selectedTranslations, setSelectedTranslations] = useState(null);

    const fetchUsersTranslations = async () => {
        let translations = []
        const userId = await AsyncStorage.getItem("user");
        const query = `/articles/${article.id}/translation/${userId}`
        const response = await axios.get(query)
        console.log("available translations", response.data);
        if(!response.data?.length) return setTranslationsForUser([]);
        for(let translation of response.data){
            translations.push({id: translation.id, content: translation.content, originalContent: article.content.slice(translation.start_char_index, translation.end_char_index)});
        }
        setTranslationsForUser(translations);
    }

    const addSelectedTranslation = (index) => {
        if(selectedTranslations === null) return setSelectedTranslations([index]);
        if(selectedTranslations?.includes(index)){
            const newSelection = selectedTranslations?.filter((item) => item !== index);
            if(newSelection.length === 0) return setSelectedTranslations([]);
            setSelectedTranslations(newSelection);
        } else {
            setSelectedTranslations([...selectedTranslations, index]);
        }
    }
    
    const alertDelete = () => {
        Alert.alert(
            "Deleting your translations",
            "Are you sure you want to delete your translations?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        deleteSelected();
                    }
                },
                { text: "No", onPress: () => console.log("Deletion cancelled") }
            ],
            { cancelable: true }
        );
    }

    const deleteSelected = async () => {
        const userId = await AsyncStorage.getItem("user");
        console.log("selected translations", selectedTranslations)
        console.log("translations for user", translationsForUser)
        for(let index of selectedTranslations){
            const query = `/articles/${article.id}/translation/delete/${translationsForUser[index].id}`
            console.log("Query", query)
            await axios.post(query);
        }
        setSelectedTranslations([]);
        fetchUsersTranslations();
    }

    const renderTranslations = () => {
        if(translationsForUser === null) return <Text>Loading translations...</Text>
        if(translationsForUser.length === 0) return <Text>No translations available</Text>
        return (translationsForUser.length !== 0 ? translationsForUser.map((translation, index) => {
            return (
                <TouchableHighlight
                    key={index}
                    style={[
                        styles.touchableHighlight,
                        selectedTranslations?.includes(index) && styles.highlighted
                    ]}
                    onPress={() => { 
                        addSelectedTranslation(index);
                    }}
                    underlayColor="transparent"
                >
                    <HStack style={styles.hStack}>
                        <Box style={styles.textContainer}>
                            <Text style={styles.text}>Original: {translation.originalContent}</Text>
                            <Text style={styles.text}>Translation: {translation.content}</Text>
                        </Box>
                    </HStack>
                </TouchableHighlight>
            )
        }) : <Text>No translations available</Text>)
    }

    useEffect(() => {
        fetchUsersTranslations();
    }, [route])

    return (
        <ScrollView alignContent={"center"}>
            <Text alignSelf={"center"} fontSize={20}>Select translations to delete</Text>
            {renderTranslations()}
            {selectedTranslations?.length > 0 && <Button marginTop={5} onPress={() => {alertDelete()}}style={{backgroundColor: "red"}}>Delete selected</Button>}
        </ScrollView>
    )
};

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
        margin: 5,
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

export default TranslationDeletionScreen;