import React from "react";
import {
  VStack,
  Box,
  Center,
  Heading,
  FormControl,
  Button,
  Text,
  Input,
  Pressable,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DecksPage = ({ navigation }) => {
  // State variables for inputs
  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');

  const createHandler = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user");
      const response = await axios.post("/groups/", {
        name: groupName,
        description: groupDescription,
        lectorId: user_id,
      });
    } catch(e) {
      console.log(e);
    }

    navigation.navigate("Groups", {});
  };


  return (
    <FormControl>
      <VStack space={3} mt="5">
      <Text fontSize="30" fontType="bold">Create a new Group</Text>
      <FormControl.Label mb="0">Group name</FormControl.Label>
      <Input size="xs" placeholder="Name" value={groupName} onChangeText={text => setGroupName(text)}/>
      <FormControl.Label mb="0">Group description</FormControl.Label>
      <Input multiline={true} size="xs" placeholder="Description" value={groupDescription} onChangeText={text => setGroupDescription(text)}/>
      <Button onPress={() => createHandler()}>Create</Button>
      </VStack>
    </FormControl>
  );
};

export default DecksPage;
