import React from 'react';
import { Box, Button, HStack } from 'native-base';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SelectionOverlay = ({ selection, closeCallback }) => {
    const showOverlay = selection[0] && selection[0].start !== selection[0].end;

    return (
        <Box 
            position="relative"
            height={70}
            top={0}
            backgroundColor={showOverlay ? "rgba(0, 0, 0, 0.3)" : "transparent"}
            display={showOverlay ? "flex" : "none"}
            justifyContent="flex-end"
        >
            {showOverlay && (
                <Box pb="4" px="4">
                    <HStack space={2}>
                        <Button onPress={() => {  }}>Add to deck</Button>
                        <Button onPress={() => { console.log("hello")  }}>Translate</Button>
                        <Button onPress={closeCallback}>Close</Button>
                    </HStack>
                </Box>
            )}
        </Box>
    );
};

export default SelectionOverlay;