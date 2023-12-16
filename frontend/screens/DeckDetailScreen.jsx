import React, { useState, useEffect } from "react";
import {
  ScrollView,
  FlatList,
  Box,
  Center,
  Heading,
  Text,
  Button,
  Fab,
  Image,
  Pressable,
} from "native-base";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const DeckDetailScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const responseDeck = await axios.get(`/decks/${deckId}`);
          setDeck(responseDeck.data);
          const responseCards = await axios.get(`/decks/${deckId}/cards`);
          setCards(responseCards.data);
        } catch (err) {
          setError("Error fetching data");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      if (isFocused) {
        fetchData();
      }
      return () => {};
    }, [deckId, isFocused, refresh]),
  );

  const handleEditPress = () => {
    navigation.navigate("DeckEdit", { deckId: deckId });
  };

  const handleDeletePress = async () => {
    try {
      const response = await axios.delete(`/decks/${deckId}`);
      navigation.navigate("Decks");
    } catch (err) {
      setError("Error deleting deck");
      console.error(err);
    }
  };

  const renderCard = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("CardDetail", { cardId: item.id, deckId: deckId })
      }
      width="48%"
    >
      <Box
        borderColor="coolGray.200"
        borderWidth="1"
        bg="white"
        p="4"
        m="2"
        rounded="md"
        shadow="3"
      >
        <Text fontSize="md" bold mb="2">
          {item.front}
        </Text>
        <Text fontSize="xs" color="coolGray.600">
          {item.back}
        </Text>
        {item.image && (
          <Image source={{ uri: item.image }} alt="Card Image" size="md" />
        )}
      </Box>
    </Pressable>
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

  return (
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
          {isFocused && (
            <Fab
              position="absolute"
              size="sm"
              icon={<Ionicons name="add" size={20} color="white" />}
              onPress={() =>
                navigation.navigate("CardCreate", {
                  deckId: deckId,
                  setRefresh,
                })
              }
              style={{ marginBottom: 35, marginRight: 20 }}
            />
          )}
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            style={{ marginTop: 10 }}
          />
        </>
      ) : (
        <Center>
          <Text>Deck not found</Text>
        </Center>
      )}
    </Box>
  );
};

export default DeckDetailScreen;
