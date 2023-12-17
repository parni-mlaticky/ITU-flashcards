/**
 * A screen for creating new groups
 * @file frontend/screens/GroupCreateSscreen.jsx
 * @author Ondřej Zobal (xzobal01)
 **/

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
  Icon,
  Pressable,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const DecksPage = ({ navigation }) => {
  // State variables for inputs
  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [valid, setValid] = React.useState(true);

  const createHandler = async () => {
    try {
      if (groupName === "") {
        setValid(false);
        return;
      }
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
    <FormControl isInvalid={!valid}>
      <VStack m="10px" space={3}>
      <Box mt="5%" alignItems="center" justifyContent="center">
        <Icon m="10px" as={Ionicons} name="create-outline" color="black" size="100" />
        <Text fontSize="30" fontType="bold" textAlign="center">Create a new Learning Group</Text>
      </Box>
      <FormControl.Label mb="0">Group name</FormControl.Label>
      <FormControl.ErrorMessage>
        Name cannot be left empty!
      </FormControl.ErrorMessage>
      <Input  placeholder="Name" value={groupName} onChangeText={text => setGroupName(text)}/>
      <FormControl.Label mb="0">Group description</FormControl.Label>
      <Input multiline={true} placeholder="Description" value={groupDescription} onChangeText={text => setGroupDescription(text)}/>
      <Button onPress={() => createHandler()}>Create</Button>
      </VStack>
    </FormControl>
  );
};

export default DecksPage;
