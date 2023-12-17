import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Input,
  Center,
  VStack,
  Flex,
  Image,
  Text,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditCardScreen = ({ route, navigation }) => {
  const { cardId, deckId } = route.params;
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCardDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/decks/${deckId}/cards/${cardId}`);
        const card = response.data;
        setFront(card.front);
        setBack(card.back);
        setImage(card.image);
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching card details");
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  const handleUpdateCard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let deck_id = Number(deckId);
      let card_id = Number(cardId);
      const response = await axios.put(
        `/decks/${deck_id}/cards/${card_id}`,
        {
          front,
          back,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigation.navigate("DeckDetail", { deckId: deckId });
    } catch (error) {
      console.error("Error updating card", error);
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
    <Flex flex={1} px={3} bg="coolGray.50" alignItems={"center"}>
      <VStack space={4} w="90%">
        <FormControl>
          <FormControl.Label>Front</FormControl.Label>
          <Input value={front} onChangeText={setFront} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Back</FormControl.Label>
          <Input value={back} onChangeText={setBack} />
        </FormControl>
        <Button onPress={handleUpdateCard}>Update Card</Button>
      </VStack>
    </Flex>
  );
};

export default EditCardScreen;
