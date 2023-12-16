import React from "react";
import { useState, useEffect } from "react";
import { VStack, Box, Center, Heading, Text, Fab, Icon } from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DecksScreen = ({ navigation }) => {
  const [decks, setDecks] = React.useState([]);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("/decks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDecks(response.data);
      } catch (error) {
        console.error("Error fetching decks", error);
      }
    };

    fetchDecks();
  }, [refresh]);
  return (
    <Center flex={1} px={3} bg="coolGray.50">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800">
          Your Decks
        </Heading>
        {decks.map((deck, index) => (
          <Text key={index}>
            {deck.name} - {deck.description}
          </Text>
        ))}
      </Box>
      {isFabVisible && (
        <Fab
          position="absolute"
          size="sm"
          icon={<Icon name="add" />}
          onPress={() => navigation.navigate("DeckCreate", { setRefresh })}
        />
      )}
    </Center>
  );
};

export default DecksScreen;
