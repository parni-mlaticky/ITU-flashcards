import { Box, Text, Center, Button, HStack } from "native-base"
import { Alert, Image, Linking, TextInput } from "react-native"
import { useEffect, useState } from "react"
import SelectionOverlay from "../components/SelectionOverlay"
import { ScrollView } from "react-native-gesture-handler"
import { useRef, useCallback } from "react"
import CommunityTranslationsList from "../components/CommunityTranslationsList"
import axios from "axios"
import DifficultyRating from "../components/DifficultyRating"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"

const ArticleDetailScreen = (article) => {
    const { navigation } = article;
    let { id, heading, cover_image_link, content, source_link } = article.route.params;

    const [showTranslations, setShowTranslations] = useState(false);
    const [selection, setSelection] = useState([]);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [translationsForUser, setTranslationsForUser] = useState([]);
    const [translation, setTranslation] = useState(null);
    const [userHasTranslation, setUserHasTranslation] = useState(false);

    const checkIfUserHasTranslation = async () => {
        const userId = await AsyncStorage.getItem("user");
        const query = `/articles/${id}/translation/${userId}`;
        const response = await axios.get(query);
        console.log("response", response.data);
        if(response.data) setUserHasTranslation(true);
        else setUserHasTranslation(false);
    }

    useEffect(() => {
        checkIfUserHasTranslation();
    }, [article.route.params, navigation])

    useFocusEffect(
        useCallback(() => {
            checkIfUserHasTranslation();
            setSelection([]);
        }, [article])
    );


    const deleteUserTranslations = async () => {
        Alert.alert(
            "Deleting your translations",
            "Are you sure you want to delete your translations?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        const userId = await AsyncStorage.getItem("user");
                        const query = `/articles/${id}/translation/delete`;
                        try {
                            await axios.post(query, {userId: userId});
                            setUserHasTranslation(false);
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting translation", error);
                        }
                    }
                },
                { text: "No", onPress: () => console.log("Deletion cancelled") }
            ],
            { cancelable: true }
        );
    };


    const handleSelect = (selection, article) => {
        setSelection([selection, article]);
    }

    const selectionHandle = (event) => {
        handleSelect(event.nativeEvent.selection, article);
        console.log(event.nativeEvent.selection);
    }

    const translationSelectCallback = async (translation) => {
        // reload this article if no translation selected
        setTranslation(translation);
        if(!translation) {
            console.log("no translation selected");
            setTranslatedContent(null);
            setTranslationsForUser([]);
            return;
        }
        const userId = translation.author_id
        console.log("translation select callback", translation);
        console.log("article", article.route.params.id)
        console.log("user", userId)
        const response = await axios.get(`/articles/${article.route.params.id}/translation/${userId}`);
        const translationsForUser = response.data;
        console.log("translations for user", translationsForUser)

        // Sort translations based on start index
        console.log("TRANS FOR USER", translationsForUser)
        translationsForUser.sort((a, b) => a.start_char_index - b.start_char_index);
        console.log("SORTED", translationsForUser)

        let offset = 0; // Tracks the shift in indices due to replacements
        let newArticleContent = content;

        for (let i = 0; i < translationsForUser.length; i++) {
            const { start_char_index: start, end_char_index: end, content: newContent } = translationsForUser[i];
            const startIndex = start + offset;
            const endIndex = end + offset;
            newArticleContent = newArticleContent.slice(0, startIndex) + newContent + newArticleContent.slice(endIndex);
            offset += newContent.length - (endIndex - startIndex);
        }
        console.log("new content", newArticleContent);
        setTranslatedContent(newArticleContent);
        setTranslationsForUser(translationsForUser);

    }

    const showCommunityTranslations = () => {
        console.log("showing translations");
        setShowTranslations(!showTranslations);
    }

    const createContentSegments = () => {
        const segments = [];
        let lastIndex = 0; 
    
        translationsForUser.forEach((translation) => {
            if (translation.start_char_index > lastIndex) {
                segments.push({
                    text: content.slice(lastIndex, translation.start_char_index),
                    translated: false
                });
            }
    
            segments.push({
                text: translation.content,
                translated: true
            });
    
            lastIndex = translation.end_char_index;
        });
    
        if (lastIndex < content.length) {
            segments.push({
                text: content.slice(lastIndex),
                translated: false
            });
        }
        return segments;
    };
    
    return (
        <>
        <ScrollView>
        <Center safeArea={5}>
            <Box>
                <Text fontSize={30}>{heading}</Text>
            </Box>
            <Box alignItems="center">
                <Image style={{margin:10}} source={{ uri: cover_image_link }} alt={heading} height={200} width={200}/>
                <HStack safeArea={2}>
                    <Button margin={1} onPress={() => { Linking.openURL(source_link) }}>Open original article</Button>
                    <Button margin={1} onPress={showCommunityTranslations} >See community translations</Button>
                </HStack>
                <CommunityTranslationsList translationSelectCallback={translationSelectCallback} article={article.route.params} show={showTranslations} />
                {
                translatedContent ? (
                <>
                    <Text style={{color: "blue"}}>Translated content</Text>
                </>
                ) : null
                }
                
                {
                    translatedContent ? (
                        <Text style={{marginTop:5, marginBottom:10, lineHeight: 25}} alignItems="center" fontSize={16}>{
                        createContentSegments().map((segment, index) => (
                            <Text
                                key={index}
                                style={{
                                    color: segment.translated ? 'blue' : 'black',
                                }}
                            >
                                {segment.text}
                            </Text>
                        ))}
                        </Text>
                    )
                    :
                    <TextInput style={{marginTop:5, marginBottom:10, lineHeight: 25}} safeArea={3} scrollEnabled={false} onSelectionChange={selectionHandle} multiline editable={false} value={translatedContent || content} alignItems="center" fontSize={16}/>

                }
            </Box>
        </Center>
        <DifficultyRating article={{id}}></DifficultyRating>
        {userHasTranslation ?  <Box safeArea={10}><Button onPress={deleteUserTranslations} style={{backgroundColor:"red"}}>Delete my translations</Button></Box> : null}
        </ScrollView>
        <SelectionOverlay navigation={navigation} selection={selection} closeCallback={() => {setSelection([])}} />
        </>
    );
};

export default ArticleDetailScreen;