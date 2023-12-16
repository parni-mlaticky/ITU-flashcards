import React, { useState } from "react";
import { Button, FormControl, Input, Center, VStack, Image } from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CardCreateScreen = ({ navigation, route }) => {
  const { deckId, setRefresh } = route.params;
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState("");

  const handleCreateCard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let deck_id = Number(deckId);
      const response = await axios.post(
        `/decks/${deck_id}/cards`,
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
      navigation.navigate("CardDetail", {
        cardId: response.data.id,
        deckId: deckId,
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating card", error);
    }
  };

  return (
    <Center flex={1} px={3} bg="coolGray.50">
      <VStack space={4} w="90%">
        <FormControl>
          <FormControl.Label>Front</FormControl.Label>
          <Input value={front} onChangeText={setFront} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Back</FormControl.Label>
          <Input value={back} onChangeText={setBack} />
        </FormControl>
        <Button onPress={handleCreateCard}>Create Card</Button>
      </VStack>
    </Center>
  );
};

export default CardCreateScreen;
