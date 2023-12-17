import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Center,
  VStack,
  Image,
  Flex,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const CardCreateScreen = ({ navigation, route }) => {
  const { deckId, setRefresh } = route.params;
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    }
  };

  const handleCreateCard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("front", front);
      formData.append("back", back);
      if (imageUri) {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append(
          "image",
          { uri: imageUri, name: filename, type },
          filename,
        );
      }

      const deck_id = Number(deckId);

      const response = await axios.post(`/decks/${deck_id}/cards`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigation.navigate("CardDetail", {
        cardId: response.data.id,
        deckId: deckId,
      });

      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating card", error);
    }
  };
  return (
    <Flex flex={1} px={3} bg="coolGray.50" alignItems={"center"}>
      <VStack space={4} w="90%">
        <FormControl>
          <FormControl.Label>Front</FormControl.Label>
          <Input value={front} onChangeText={setFront} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Back</FormControl.Label>
          <Input value={back} onChangeText={setBack} />
        </FormControl>
        <Button onPress={handleSelectImage} mt={2}>
          Select Image
        </Button>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            alt="Selected Image"
            size="md"
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        )}
        <Button onPress={handleCreateCard} mt={2}>
          Create Card
        </Button>
      </VStack>
    </Flex>
  );
};

export default CardCreateScreen;
