import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Center,
  VStack,
  Heading,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeckCreateScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { setRefresh } = route.params;

  const handleCreateDeck = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const author_id = Number(await AsyncStorage.getItem("user"));
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

      navigation.navigate("Decks");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating deck", error);
    }
  };

  return (
    <Center flex={1} px={4} bg="blueGray.100">
      <Heading color="emerald.500" fontSize="xl" mb={6}>
        Create New Deck
      </Heading>
      <VStack space={5} w="90%" maxW="400px">
        <FormControl>
          <FormControl.Label _text={{ color: "coolGray.800" }}>
            Name
          </FormControl.Label>
          <Input
            value={name}
            onChangeText={setName}
            bg="white"
            borderColor="coolGray.300"
            _focus={{ borderColor: "emerald.500" }}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label _text={{ color: "coolGray.800" }}>
            Description
          </FormControl.Label>
          <Input
            value={description}
            onChangeText={setDescription}
            bg="white"
            borderColor="coolGray.300"
            _focus={{ borderColor: "emerald.500" }}
            multiline
            numberOfLines={4}
          />
        </FormControl>
        <Button
          colorScheme="emerald"
          onPress={handleCreateDeck}
          _text={{ color: "white" }}
        >
          Create Deck
        </Button>
      </VStack>
    </Center>
  );
};

export default DeckCreateScreen;
