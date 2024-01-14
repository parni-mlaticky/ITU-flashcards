/**
 * @file Article details screen, shown when user selects an article on the articles page.
 * Allows users to view the article, view community translations, and rate the difficulty of the article.
 * Users can also delete the article if they are the author of the article, or delete their translations of the article.
 * Users can also view and post comments on the article.
 * @author Vladimír Hucovič
 */

import { Box, Text, Center, Button, HStack, Drawer, KeyboardAvoidingView, VStack } from "native-base"
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
import DiscussionComponent from "../components/DiscussionComponent"
import { StyleSheet } from "react-native"

const ArticleDetailScreen = (article) => {
    const { navigation } = article;
    let { id, heading, cover_image_link, content, source_link, author_id } = article.route.params;

    const [showTranslations, setShowTranslations] = useState(false);
    const [selection, setSelection] = useState([]);
    const [translatedContent, setTranslatedContent] = useState(null);
    const [translationsForUser, setTranslationsForUser] = useState([]);
    const [translation, setTranslation] = useState(null);
    const [userHasTranslation, setUserHasTranslation] = useState(false);
    const [authorName, setAuthorName] = useState(null);
    const [userIsAuthor, setUserIsAuthor] = useState(false);



    const getAuthorName = async () => {
        if(!author_id) {
            setAuthorName(null);
            return;
        }
        try {
            const response = await axios.get(`/users/name/${author_id}`);
            setAuthorName(response.data.username);
        } catch (error) {
            console.error("Error fetching author name:", error);
            setAuthorName(null);
        }
    };

    const deleteArticle = () => {
        Alert.alert(
            "Deleting this article",
            "Are you sure you want to delete this article?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        const response = await axios.delete(`/articles/${id}`);
                        navigation.navigate("Articles");
                    }
                },
                { text: "No", onPress: () => {} }
            ],
            { cancelable: true }
        );
    }

    useEffect(() => {
        if(!author_id) return;
        const checkIfUserIsAuthor = async () => {
            const userId = await AsyncStorage.getItem("user");
            setUserIsAuthor(userId == author_id);
        }
        checkIfUserIsAuthor();
        
        getAuthorName();
    }, [author_id])

    const checkIfUserHasTranslation = async () => {
        const userId = await AsyncStorage.getItem("user");
        const query = `/articles/${id}/translation/${userId}`;
        const response = await axios.get(query);
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
        navigation.navigate("DeleteTranslation", {article: article.route.params})
    };


    const handleSelect = (selection, article) => {
        setSelection([selection, article]);
    }

    const selectionHandle = (event) => {
        handleSelect(event.nativeEvent.selection, article);
    }

    const translationSelectCallback = async (translation) => {
        setTranslation(translation);
        if(!translation) {
            setTranslatedContent(null);
            setTranslationsForUser([]);
            return;
        }
        const userId = translation.author_id
        const response = await axios.get(`/articles/${article.route.params.id}/translation/${userId}`);
        const translationsForUser = response.data;

        translationsForUser.sort((a, b) => a.start_char_index - b.start_char_index);

        let offset = 0;
        let newArticleContent = content;

        for (let i = 0; i < translationsForUser.length; i++) {
            const { start_char_index: start, end_char_index: end, content: newContent } = translationsForUser[i];
            const startIndex = start + offset;
            const endIndex = end + offset;
            newArticleContent = newArticleContent.slice(0, startIndex) + newContent + newArticleContent.slice(endIndex);
            offset += newContent.length - (endIndex - startIndex);
        }
        setTranslatedContent(newArticleContent);
        setTranslationsForUser(translationsForUser);
    }

    const showCommunityTranslations = () => {
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

    const getAuthorNameComponent = () => {
        if(!authorName) return null;
        return (
        <VStack>
            <Text alignSelf={"center"} style={{color:"blue"}}>Community-created article</Text>
            <Text alignSelf={"center"}>Author: {authorName}</Text>
        </VStack>
        )
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} removeClippedSubviews={false}>
        <ScrollView width={"100%"} removeClippedSubviews={false}>
        <Center width={"100%"} safeArea={5} removeClippedSubviews={false}>
            <Box>
                <Text fontSize={30}>{heading}</Text>
            </Box>
            <Box alignItems="center" removeClippedSubviews={false}>
                <Image borderWidth={2} borderColor={"black"} borderRadius={10} style={{margin:10}} source={{ uri: cover_image_link }} alt={heading} height={200} width={300}/>
                <HStack safeArea={2}>
                    {authorName === null ? (<Button margin={1} onPress={() => { Linking.openURL(source_link) }}>Open original article</Button>) : getAuthorNameComponent()}
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
                <Box style={{width: "100%"}} minH={20} backgroundColor={"lightgrey"} removeClippedSubviews={false}>
                {
                    translatedContent ? (
                        <Text style={{marginTop:5, marginBottom:10, lineHeight: 25, padding:20}} alignItems="center" fontSize={16}>{
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
                    <TextInput
                        style={{marginTop:5, marginBottom:10, lineHeight: 25, padding: 20}} 
                        safeArea={3} scrollEnabled={false} removeClippedSubviews={false} onSelectionChange={selectionHandle}
                        multiline editable={false} value={translatedContent || content} alignItems="center"
                        fontSize={16}
                    />
                }
                </Box>
            </Box>
        </Center>
        <DifficultyRating article={{id}}></DifficultyRating>
        {userIsAuthor && <Button margin={4} onPress={deleteArticle} style={{backgroundColor:"red"}}>Delete this article</Button>}
        {userHasTranslation ?  <Box safeArea={4
        }><Button onPress={deleteUserTranslations} style={{backgroundColor:"red"}}>Delete my translations</Button></Box> : null}
        <DiscussionComponent article={article.route.params}/>
        </ScrollView>
        <SelectionOverlay navigation={navigation} selection={selection} closeCallback={() => {setSelection([])}} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    selectionOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

export default ArticleDetailScreen;
