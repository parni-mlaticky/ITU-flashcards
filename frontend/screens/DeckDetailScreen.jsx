import React, { useState, useEffect } from "react";
import { ScrollView, Box, Center, Heading, Text } from "native-base";
import axios from "axios";

const DeckDetailScreen = ({ route }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [deckId]);

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
      <Box safeArea p="2">
        {deck ? (
          <>
            <Heading>{deck.name}</Heading>
            <Text>{deck.description}</Text>
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
