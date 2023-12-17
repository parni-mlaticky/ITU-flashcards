/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: CardDetailScreen.jsx
 *  @brief: Screen for displaying card details
 */
import React, { useState, useEffect } from "react";
import { Image, Dimensions } from "react-native";
import { Box, Text, Center, VStack, Pressable, Button } from "native-base";
import axios from "axios";
import BASE_URL from "../url";

const CardDetailScreen = ({ route, navigation }) => {
  const { cardId, deckId } = route.params;
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBack, setShowBack] = useState(false);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        let response = await axios.get(`/decks/${deckId}/cards/${cardId}`);
        response.data.image = BASE_URL + response.data.image;
        setCard(response.data);
      } catch (err) {
        setError("Error fetching card details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [cardId, deckId]);

  if (isLoading) {
    return (
      <Center flex={1}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1}>
        <Text>{error}</Text>
      </Center>
    );
  }

  if (!card) {
    return (
      <Center flex={1}>
        <Text>Card not found</Text>
      </Center>
    );
  }

  const handleCardPress = () => {
    setShowBack(!showBack);
  };

  const handleEditPress = () => {
    navigation.navigate("CardEdit", { cardId: cardId, deckId: deckId });
  };

  const handleDeletePress = async () => {
    try {
      await axios.delete(`/decks/${deckId}/cards/${cardId}`);
      navigation.navigate("DeckDetail", { deckId: deckId });
    } catch (err) {
      setError("Error deleting card");
      console.error(err);
    }
  };

  return (
    <Center flex={1} px={3}>
      <Pressable onPress={handleCardPress}>
        <Box
          width={width * 0.9}
          height={height * 0.7}
          bg="white"
          rounded="lg"
          shadow={3}
          justifyContent="center"
          alignItems="center"
          p={5}
        >
          {showBack ? (
            <VStack space={4} alignItems="center">
              <Text fontSize="xl" bold textAlign="center">
                {card.back}
              </Text>
              {card.image && (
                <Image
                  source={{ uri: card.image }}
                  style={{ width: width * 0.8, height: height * 0.4 }}
                  resizeMode="contain"
                />
              )}
            </VStack>
          ) : (
            <VStack space={4} alignItems="center">
              <Text fontSize="xl" bold textAlign="center">
                {card.front}
              </Text>
            </VStack>
          )}
        </Box>
      </Pressable>
      <Button onPress={handleEditPress} colorScheme="blue" mt={4}>
        Edit Card
      </Button>
      <Button onPress={handleDeletePress} colorScheme="red" mt={2}>
        Delete Card
      </Button>
    </Center>
  );
};

export default CardDetailScreen;
