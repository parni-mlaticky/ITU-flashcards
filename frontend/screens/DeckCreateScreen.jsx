import React, { useState } from "react";
import { Button, FormControl, Input, Center, VStack, Text } from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "./url";

axios.defaults.baseURL = BASE_URL;

const DeckCreateScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateDeck = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const author_id = await AsyncStorage.getItem("user").id;
      const response = await axios.post(
        "/decks",
        {
          author_id,
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Deck created:", response.data);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating deck", error);
    }
  };

  return (
    <Center flex={1} px={3} bg="coolGray.50">
      <VStack space={4} w="90%">
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={name} onChangeText={setName} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={description} onChangeText={setDescription} />
        </FormControl>
        <Button onPress={handleCreateDeck}>Create Deck</Button>
      </VStack>
    </Center>
  );
};

export default DeckCreateScreen;
