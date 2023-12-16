import React, { useState, useEffect } from "react";
import { ScrollView, Box, Center, Heading, Text, Button } from "native-base";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const DeckDetailScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      const fetchDeck = async () => {
        try {
          const response = await axios.get(`/decks/${deckId}`);
          setDeck(response.data);
        } catch (err) {
          setError("Error fetching deck details");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDeck();
      return () => {};
    }, [deckId]),
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
    navigation.navigate("DeckEdit", { deckId: deckId });
  };

  const handleDeletePress = async () => {
    try {
      const id = Number(deckId);
      const response = await axios.delete(`/decks/${id}`);
      navigation.navigate("Decks");
    } catch (err) {
      setError("Error deleting deck");
      console.error(err);
    }
  };

  return (
    <ScrollView>
      <Box safeArea p="2">
        {deck ? (
          <>
            <Heading>{deck.name}</Heading>
            <Text mb="4">{deck.description}</Text>
            <Button onPress={handleEditPress} colorScheme="blue">
              Edit Deck
            </Button>
            <Button onPress={handleDeletePress} colorScheme="red" mt={4}>
              Delete Deck
            </Button>
          </>
        ) : (
          <Center>
            <Text>Deck not found</Text>
          </Center>
        )}
      </Box>
    </ScrollView>
  );
};

export default DeckDetailScreen;
