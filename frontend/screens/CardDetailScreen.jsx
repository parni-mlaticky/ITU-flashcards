import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Box,
  Center,
  Heading,
  Text,
  Button,
  Image,
} from "native-base";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import BASE_URL from "../url";

const CardDetailScreen = ({ route, navigation }) => {
  const { cardId, deckId } = route.params;
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
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

      if (isFocused) {
        fetchCard();
      }
      return () => {};
    }, [cardId, isFocused]),
  );

  if (isLoading) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>{error}</Text>
      </Center>
    );
  }

  const handleEditPress = () => {
    navigation.navigate("CardEdit", { cardId: cardId, deckId: deckId });
  };

  const handleDeletePress = async () => {
    try {
      const response = await axios.delete(`/decks/${deckId}/cards/${cardId}`);
      navigation.navigate("DeckDetail", { deckId: deckId });
    } catch (err) {
      setError("Error deleting card");
      console.error(err);
    }
  };

  return (
    <ScrollView>
      <Box safeArea p="2">
        {card ? (
          <>
            <Heading>Card Details</Heading>
            <Text mb="2">Front: {card.front}</Text>
            <Text mb="4">Back: {card.back}</Text>
            {card.image && (
              <Image source={{ uri: card.image }} alt="Card Image" size="md" />
            )}
            <Button onPress={handleEditPress} colorScheme="blue">
              Edit Card
            </Button>
            <Button onPress={handleDeletePress} colorScheme="red" mt={4}>
              Delete Card
            </Button>
          </>
        ) : (
          <Center>
            <Text>Card not found</Text>
          </Center>
        )}
      </Box>
    </ScrollView>
  );
};

export default CardDetailScreen;
