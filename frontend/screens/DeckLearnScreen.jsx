import React, { useState, useEffect } from "react";
import { Image, Dimensions } from "react-native";
import {
  Box,
  Text,
  Center,
  VStack,
  Pressable,
  HStack,
  Icon,
} from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import BASE_URL from "../url";

const DeckLearnScreen = ({ route }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [statistics, setStatistics] = useState({ known: 0, unknown: 0 });

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`/decks/${deckId}/cards`);
        const updatedCards = response.data.map((card) => ({
          ...card,
          image: card.image ? BASE_URL + card.image : null,
        }));
        setCards(shuffleArray(updatedCards));
      } catch (error) {
        console.error("Error fetching cards", error);
      }
    };

    fetchCards();
  }, [deckId]);

  useEffect(() => {
    if (currentIndex >= cards.length) {
      console.log("Final Statistics:", statistics);
    }
  }, [currentIndex, cards.length, statistics]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleCardPress = () => setShowBack(!showBack);

  const handleResponse = (response) => {
    setStatistics((prevStats) => ({
      ...prevStats,
      [response]: prevStats[response] + 1,
    }));

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex;
    });
    setShowBack(false);
  };

  const currentCard = cards[currentIndex];

  if (cards.length === 0) {
    return (
      <Center flex={1}>
        <Text fontSize="xl">No cards in this deck</Text>
      </Center>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <Center flex={1}>
        <Text fontSize="xl">Results:</Text>
        <Text fontSize="lg">Known: {statistics.known}</Text>
        <Text fontSize="lg">Unknown: {statistics.unknown}</Text>
      </Center>
    );
  }

  if (cards.length === 0) {
    return (
      <Center flex={1}>
        <Text fontSize="xl">No cards in this deck</Text>
      </Center>
    );
  }

  if (!currentCard) {
    return (
      <Center flex={1}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <Center flex={1} px={5}>
      <Pressable onPress={handleCardPress}>
        <Box
          width={width * 0.9}
          height={height * 0.8}
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
                {currentCard.back}
              </Text>
              {currentCard.image && (
                <Image
                  source={{ uri: currentCard.image }}
                  style={{ width: width * 0.8, height: height * 0.4 }}
                  resizeMode="contain"
                />
              )}
            </VStack>
          ) : (
            <Text fontSize="xl" bold textAlign="center">
              {currentCard.front}
            </Text>
          )}
        </Box>
      </Pressable>
      <HStack justifyContent="space-between" mt={5} px={5} width="100%">
        <Pressable onPress={() => handleResponse("unknown")}>
          <Icon
            as={FontAwesome5}
            name="times-circle"
            size="lg"
            color="red.500"
          />
        </Pressable>
        <Pressable onPress={() => handleResponse("known")}>
          <Icon as={FontAwesome5} name="heart" size="lg" color="green.500" />
        </Pressable>
      </HStack>
    </Center>
  );
};

export default DeckLearnScreen;
