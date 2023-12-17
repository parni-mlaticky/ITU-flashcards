/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: MarketplaceScreen.jsx
 *  @brief: Screen for displaying marketplace decks
 */
import React, { useState, useEffect } from "react";
import { FlatList, Pressable } from "react-native";
import { Box, Center, Heading, Text, Fab, ScrollView } from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const MarketplaceScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("/marketplace", {
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
          isMarketplace: true,
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
        Marketplace Decks
      </Heading>
      <FlatList
        data={decks}
        renderItem={renderDeck}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </Center>
  );
};

export default MarketplaceScreen;
