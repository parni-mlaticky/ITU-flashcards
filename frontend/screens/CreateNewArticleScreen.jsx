/**
 * @file Create new article screen, shown when user selects the Create New Article tab in the bottom navigation bar.
 * @author Vladimír Hucovič
 */

import { HStack, Box, Text, Button, Image } from "native-base";
import { TouchableHighlight } from "react-native";
import { StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


const CreateNewArticleScreen = ({navigation, route}) => {
    const [imageUri, setImageUri] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSelectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera roll permissions to make this work!",
          );
        } else {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
    
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
          }
        }
      };

    const createArticle = async () => {
        const userId = await AsyncStorage.getItem("user");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("author_id", userId);
        if (imageUri) {
            const filename = imageUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image";

            const response = await fetch(imageUri);
            const blob = await response.blob();
            formData.append(
            "articleImg",
            { uri: imageUri, name: filename, type },
            filename,
            );
        }
        const response = await axios.post(`/articles`, formData, {headers: {"Content-Type": "multipart/form-data"}});
        navigation.goBack();
    }


    const originalForm = () => {
        return (
            <Box margin={10}>
            <TextInput onChangeText={(newText) => setTitle(newText)} margin={5} placeholderTextColor={"grey"} placeholder={"Article title"} style={[styles.textInputHeader]}></TextInput>
            <TextInput onChangeText={(newText) => setContent(newText)} margin={5}placeholderTextColor={"grey"} style={[styles.textInputContent]} placeholder="Article content" multiline></TextInput>
            <Button margin={2} onPress={handleSelectImage}>Add an image</Button>
            {imageUri && (<><Text style={{alignSelf:"center"}}>Selected image:</Text><Image alt={"image"} source={{uri: imageUri}} style={{alignSelf:"center" ,width: 200, height: 200}}/></>)}
            {title !== "" && content !== "" && <Button onPress={createArticle} margin={2}>Create article</Button>}
            </Box>
        )
    }

    const renderForm = () => {
        return originalForm();
    }

    return (
        <>
        <Text alignSelf={"center"} fontSize={20} margin={5} style={{color: "blue"}}>Create a new article</Text>
        {renderForm()}
        </>
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
        margin: 20,
        textAlign: 'left',
    },
    inputContainer: {
        width: '80%'
    },
    textInputHeader: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        minHeight: 70,
        fontSize: 16
    },
    textInputContent: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        minHeight: 150,
        fontSize: 16
    },
    highlighted: {
        backgroundColor: 'lightblue'
    },
});

export default CreateNewArticleScreen;
    