/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: DecksScreen.jsx
 *  @brief: Screen for displaying all decks
 */
import React, { useState, useEffect } from "react";
import { FlatList, Pressable } from "react-native";
import { Box, Center, Heading, Text, Fab, ScrollView } from "native-base";
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
      onPress={() =>
        navigation.navigate("DeckDetail", {
          deckId: item.id,
          isMarketplace: false,
        })
      }
    >
      <Box
        borderColor="coolGray.200"
        borderWidth="1"
        bg="green.50"
        p="5"
        m="3"
        rounded="lg"
        shadow="5"
        width="90%"
        maxWidth="400px"
      >
        <Text fontSize="lg" bold mb="2">
          {item.name}
        </Text>
        <ScrollView>
          <Text fontSize="sm" color="coolGray.600">
            {item.description}
          </Text>
        </ScrollView>
      </Box>
    </Pressable>
  );

  return (
    <Center flex={1} bg="coolGray.50">
      <Heading size="xl" fontWeight="600" color="coolGray.800" p="4">
        Your Decks
      </Heading>
      <FlatList
        data={decks}
        renderItem={renderDeck}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ alignItems: "center" }}
      />
      {isFocused && (
        <Fab
          position="absolute"
          size="sm"
          icon={<Ionicons name="add" size={24} color="white" />}
          onPress={() => navigation.navigate("DeckCreate", { setRefresh })}
          style={{ marginBottom: 65, marginRight: 30 }}
          colorScheme="emerald"
        />
      )}
    </Center>
  );
};

export default DecksScreen;
