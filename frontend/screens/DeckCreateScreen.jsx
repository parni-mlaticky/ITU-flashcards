/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: AuthMiddleware.jsx
 *  @brief: Middleware for authentication
 */
import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Flex,
  VStack,
  Heading,
  HStack,
  Text,
  Switch,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeckCreateScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isShared, setIsShared] = useState(false);
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
          isShared,
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
    <Flex flex={1} px={4} bg="blueGray.100" mt={5} alignItems={"center"}>
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
        <HStack alignItems="center" space={2}>
          <Text>Share on Marketplace:</Text>
          <Switch
            isChecked={isShared}
            onToggle={() => setIsShared(!isShared)}
            colorScheme="emerald"
          />
        </HStack>
        <Button
          colorScheme="emerald"
          onPress={handleCreateDeck}
          _text={{ color: "white" }}
        >
          Create Deck
        </Button>
      </VStack>
    </Flex>
  );
};

export default DeckCreateScreen;
