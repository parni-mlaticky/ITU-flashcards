import React, { useState, useEffect } from "react";
import { FlatList, Pressable } from "react-native"; // Import FlatList and Pressable
import { Box, Center, Heading, Text, Fab } from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const DecksScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

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

    if (isFocused) {
      fetchDecks();
    }
  }, [isFocused, refresh]);

  const renderDeck = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("DeckDetail", { deckId: item.id })}
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
          {item.name}
        </Text>
        <Text fontSize="xs" color="coolGray.600">
          {item.description}
        </Text>
      </Box>
    </Pressable>
  );

  return (
    <Center flex={1} bg="coolGray.50">
      <Heading size="lg" fontWeight="600" color="coolGray.800" p="4">
        Your Decks
      </Heading>
      <FlatList
        data={decks}
        renderItem={renderDeck}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
      />
      {isFocused && (
        <Fab
          position="absolute"
          size="sm"
          icon={<Ionicons name="add" size={20} color="white" />}
          onPress={() => navigation.navigate("DeckCreate", { setRefresh })}
          style={{ marginBottom: 35, marginRight: 20 }}
        />
      )}
    </Center>
  );
};

export default DecksScreen;
