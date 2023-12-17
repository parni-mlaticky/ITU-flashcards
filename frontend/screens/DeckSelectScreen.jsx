/**
 * @file Screen for selecting a deck to add a card to, when user selects a word in an article and chooses to add it to a deck.
 * @author Vladimír Hucovič
 */

import { useState, useEffect }from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableHighlight } from 'react-native'
import { StyleSheet } from 'react-native'

const DeckSelectScreen = ({ navigation, route }) => {
    const { front, back } = route.params;
    console.log("ROUTE", route)

    useEffect(() => {
        fetchDecks();
    }, [])

    const [decks, setDecks] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);

    const fetchDecks = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log("token", token)
        const response = await axios.get("/decks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("decks", response.data);
        setDecks(response.data);
    }

    const addToDeck = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log("frontback", front, back);
        const response = await axios.post(`/decks/${decks[selectedDeck].id}/cards`, {front, back}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response", response.data);
        navigation.navigate("Decks");
    }

    const renderDecks = () => {
        if(decks === null) return <Text>Loading decks...</Text>
        if(decks.length === 0) return <Text>No decks available</Text>
        return decks.map((deck, index) => {
            return (
                <TouchableHighlight onPress={() => {setSelectedDeck(index)}} key={index} underlayColor="transparent" style={[
                    styles.touchableHighlight,
                    selectedDeck === index && styles.highlighted
                ]}>
                    <HStack style={styles.hStack}>
                        <Box style={styles.textContainer}>
                            <Text style={styles.text}>{deck.name}</Text>
                            <Text style={styles.text}>{deck.description}</Text>
                        </Box>
                    </HStack>
                </TouchableHighlight>
            )
        })
    }
    
    return (
        <Box margin={10}>
            <Text>Select a deck</Text>
            {renderDecks()}
            {selectedDeck !== null && <Button marginTop={5} onPress={addToDeck}>Add to deck</Button>}
        </Box>
    )
}

const styles = StyleSheet.create({
    touchableHighlight: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    highlighted: {
        backgroundColor: 'lightblue',
    },
    textContainer: {
        width: '100%',
        padding: 10,
    },
    text: {
        fontSize: 16,
    },
    hStack: {
        width: '100%',
    },
});

export default DeckSelectScreen