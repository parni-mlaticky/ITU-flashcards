/**
 * @file Selection overlay component, shown when user selects text in an article.
 * Allows user to create a translation, add the selected text to a deck or check community translations for the selected text.
 * User can also close the overlay.
 * @author Vladimír Hucovič
 */

import { Box, Button, HStack, VStack } from 'native-base';
import { useState } from 'react';


const SelectionOverlay = ({navigation, selection, closeCallback, position_properties, headerSelection}) => {
    const showOverlay = selection[0] && selection[0].start !== selection[0].end;
    console.log(selection)

    const createTranslationHandler = async () => {
        console.log("create translation");
        console.log("navigation", navigation)
        console.log("selection", selection)
        navigation.navigate("CreateTranslation", {selection: selection[0], article: selection[1]});
    }

    const checkCommunityTranslationsHandler = () => {
        navigation.navigate("CommunityTranslationScreen", {selection: selection[0], article: selection[1].route.params})
        console.log("check community translations");
    }

    return (
        <Box 
            position={position_properties?.position || "relative"}
            height={position_properties?.height || 200}
            top={position_properties?.top || 0}
            backgroundColor={showOverlay ? "rgba(0, 0, 0, 0.3)" : "transparent"}
            display={showOverlay ? "flex" : "none"}
            justifyContent="flex-end"
        >
            {showOverlay && (
                <Box pb="4" px="4">
                    <VStack space={2}>
                        <Button onPress={() => { navigation.navigate("AddCardToDeck", {selection: selection[0], article: selection[1].route.params}) }}>Add to deck</Button>
                        <Button onPress={() => { createTranslationHandler()  }}>Create translation</Button>
                        <Button onPress={checkCommunityTranslationsHandler}>Check community translations</Button>
                        <Button style={{backgroundColor: "red"}} onPress={closeCallback}>Close</Button>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default SelectionOverlay;