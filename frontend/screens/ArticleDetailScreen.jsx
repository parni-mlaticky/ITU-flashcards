import { Box, Text, Center, Button } from "native-base"
import { Image, Linking, TextInput } from "react-native"
import { useEffect, useState } from "react"
import SelectionOverlay from "../components/SelectionOverlay"

const ArticleDetailScreen = (article) => {
    const { heading, cover_image_link, content, source_link } = article.route.params;

    const [selection, setSelection] = useState([]);

    const handleSelect = (selection, article) => {
        setSelection([selection, article]);
    }

    const selectionHandle = (event) => {
        handleSelect(event.nativeEvent.selection, article);
    }

    return (
        <>
        <Center>
            <Box>
                <Text fontSize={20}>{heading}</Text>
            </Box>
            <Box>
                <Image source={{ uri: cover_image_link }} alt={heading} height={200} width={200}/>
                <TextInput onSelectionChange={selectionHandle} multiline editable={false} value={content} alignItems="center" fontSize={11}></TextInput>
            </Box>
            <Button onPress={() => { Linking.openURL(source_link) }}>Open article</Button>
        </Center>
        <SelectionOverlay selection={selection} closeCallback={() => {setSelection([])}} />
        </>
    );
};

export default ArticleDetailScreen;