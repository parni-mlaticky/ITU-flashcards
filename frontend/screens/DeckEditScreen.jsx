import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Box,
  Button,
  FormControl,
  Input,
  Center,
  VStack,
  Text,
} from "native-base";
import axios from "axios";

import BASE_URL from "./url";

axios.defaults.baseURL = BASE_URL;

const DeckEditScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(`/decks/${deckId}`);
        setDeck(response.data);
      } catch (err) {
        setError("Error fetching deck");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeck();
  }, [deckId]);

  const handleUpdateDeck = async () => {
    try {
      await axios.put(`/decks/${deckId}`, deck);
      navigation.goBack();
    } catch (err) {
      setError("Error updating deck");
      console.error(err);
    }
  };

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

  return (
    <ScrollView>
      <VStack space={4} w="90%" mx="auto">
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input
            value={deck.name}
            onChangeText={(value) => setDeck({ ...deck, name: value })}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input
            value={deck.description}
            onChangeText={(value) => setDeck({ ...deck, description: value })}
          />
        </FormControl>
        <Button onPress={handleUpdateDeck}>Update Deck</Button>
      </VStack>
    </ScrollView>
  );
};

export default DeckEditScreen;