import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  VStack,
  Box,
  Text,
  Image,
  View,
  Center,
  Heading,
  Button,
  FormControl,
  ScrollView,
  Fab
} from "native-base";
import { Keyboard } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ArticlePreview from "../components/ArticlePreview";
import SelectionOverlay from "../components/SelectionOverlay";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import BASE_URL from "../url";

const ArticlesScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
    useEffect(() => {
        const fetchArticles = async () => {
          try {
            const response = await axios.get("/articles");
            const updatedArticles = response.data.map((article) => ({
              ...article,
              cover_image_link: article.cover_image_link && article.cover_image_link.startsWith("public")
                ? BASE_URL + article.cover_image_link
                : article.cover_image_link,
            }));
            setData(updatedArticles);
          } catch (error) {
            console.error("Error fetching articles", error);
          }   
    };   
    
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("fetching");
      fetchArticles();
    });
    
      fetchArticles();
      return unsubscribe;
    }, [navigation]);

    const [selection, setSelection] = useState([]);
    const isFocused = useIsFocused();


    const handleSelect = (selection, article) => {
      setSelection([selection, article]);
      console.log(selection)
    }

    const unselect = () => {
      console.log("unselecting");
      setSelection([]);
    }

    const handleOpenArticle = (article) => {
      navigation.navigate("ArticleDetail", article);
    }

    const handleAddToDeck = () => {
      console.log("add to deck pressed");
    }

  return (
    <>
    <ScrollView>
    <Box flex={1} px={2} bg="coolGray.50">
      <Box safeArea p="0" py="0" w="100%" maxW="400">
        {
          data ? (
            <VStack space={2} mt="0">
              <View>
                {data.map((article) => {
                  return (
                    <Box key={article.id}>
                      <ArticlePreview navigation={navigation} unselectCallback={unselect} previewSelectHandler={handleSelect} article={article} openArticleCallback={handleOpenArticle} />
                      { selection.length && selection[1].id === article.id ? <SelectionOverlay headerSelection={true} navigation={navigation} selection={selection} closeCallback={() => setSelection([])} /> : null }
                    </Box>
                  );
                })}
              </View>
            </VStack>
          ) :
          (<Text>Loading...</Text>)
        }
      </Box>
    </Box>
    </ScrollView>
    {isFocused && <Fab
          position="absolute"
          size="sm"
          icon={<Ionicons name="add" size={24} color="white" />}
          onPress={() => {navigation.navigate("CreateNewArticleScreen")}}
          style={{ marginBottom: 65, marginRight: 5 }}
          colorScheme="blue"
        /> }
    </>
  );
};

export default ArticlesScreen;
