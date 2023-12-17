/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: DeckDetailScreen.jsx
 *  @brief: Screen for displaying deck details
 */
import React, { useState, useEffect } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  Fab,
  Image,
  VStack,
  useTheme,
  View,
} from "native-base";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeckDetailScreen = ({ route, navigation }) => {
  const { deckId, isMarketplace } = route.params;
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isFocused = useIsFocused();
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          const responseDeck = await axios.get(`/decks/${deckId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDeck(responseDeck.data);
          const responseCards = await axios.get(`/decks/${deckId}/cards`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
    }, [deckId, isFocused]),
  );

  const handleEditPress = () => navigation.navigate("DeckEdit", { deckId });
  const handleDeletePress = async () => {
    try {
      await axios.delete(`/decks/${deckId}`);
      navigation.navigate("Decks");
    } catch (err) {
      setError("Error deleting deck");
      console.error(err);
    }
  };

  const handleAddToDecks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `/decks/${deckId}/copy`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigation.navigate("Decks");
    } catch (err) {
      setError("Error adding deck");
      console.error(err);
    }
  };

  const renderCard = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("CardDetail", { cardId: item.id, deckId })
      }
      style={styles.cardContainer}
    >
      <Box bg="white" shadow={2} rounded="lg" p="4" alignItems="center">
        <Text fontSize="md" bold mb="2" color="coolGray.800">
          {item.front}
        </Text>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            alt="Card Image"
            size="md"
            mb="2"
          />
        )}
        <Text fontSize="xs" color="coolGray.600">
          {item.back}
        </Text>
      </Box>
    </Pressable>
  );

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

  return (
    <Box safeArea p="2" flex={1} bg={theme.colors.coolGray[50]}>
      {deck ? (
        <VStack space={4}>
          <Heading color={theme.colors.indigo[500]}>{deck.name}</Heading>
          <Text fontSize="sm" mb={4}>
            {deck.description}
          </Text>
          <Button
            onPress={() => navigation.navigate("DeckLearn", { deckId })}
            colorScheme="emerald"
            mb={3}
          >
            Learn Deck
          </Button>
          {!isMarketplace && (
            <View key={"nonMarketPlace"}>
              <Button onPress={handleEditPress} colorScheme="blue" mb={2}>
                Edit Deck
              </Button>
              <Button onPress={handleDeletePress} colorScheme="red" mb={4}>
                Delete Deck
              </Button>
            </View>
          )}
          {isMarketplace && (
            <View key={"marketplace"}>
              <Button onPress={handleAddToDecks} colorScheme="emerald" mb={3}>
                Add to Decks
              </Button>
            </View>
          )}
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
            key={deckId}
            numColumns={2}
          />
          {!isMarketplace && isFocused && (
            <Fab
              position="absolute"
              size="sm"
              icon={<Ionicons name="add" size={20} color="white" />}
              onPress={() => navigation.navigate("CardCreate", { deckId })}
              style={{ bottom: 75, right: 15 }}
              colorScheme="emerald"
            />
          )}
        </VStack>
      ) : (
        <Center flex={1}>
          <Text>Deck not found</Text>
        </Center>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "48%",
    margin: "1%",
  },
});

export default DeckDetailScreen;
