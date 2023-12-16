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
  ScrollView
} from "native-base";
import { Keyboard } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ArticlePreview from "../components/ArticlePreview";
import SelectionOverlay from "../components/SelectionOverlay";

const ArticlesScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
    useEffect(() => {
        const fetchArticles = async () => {
          try {
            const response = await axios.get("/articles");
            setData(response.data);
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
    <ScrollView>
    <Box flex={1} px={3} bg="coolGray.50">
      <Box safeArea p="4" py="0" w="100%" maxW="400">
        {
          data ? (
            <VStack space={3} mt="5">
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
  );
};

export default ArticlesScreen;
