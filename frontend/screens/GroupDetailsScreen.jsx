import React from "react";
import {
  VStack,
  HStack,
  Box,
  Center,
  Heading,
  FormControl,
  Button,
  Text,
  Pressable,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupDetails = ({ groupId }) => {
  if (typeof groupId == undefined) {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }
  let [group, setGroup] = React.useState(null);
  let [lectorName, setLectorName] = React.useState(null);
  let [members, setMembers] = React.useState([]);

  const renderGroups = async () => {
    try {
      const data = await axios.get(`/groups/${groupId}`);
      setGroup(data.data);
      const username = (await axios.get(`/users/name/${data.data.lector_id}`));
      setLectorName(username.data.username);
      const members = (await axios.get(`/groups/${groupId}/members`));
      setMembers(members.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
    renderGroups();
    }, [])
  );

  const onJoinPress = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user");
      const response = await axios.post(`/groups/${groupId}/join/`, {user_id,});
      renderGroups();

    } catch (e) {
      console.log(e);
    }
  }

  if (group) {
    return (
      <>
        <Text fontSize="30">{group.name}</Text>
        <Text fontSize="30">{`taught by ${lectorName}`}</Text>
        <HStack bg={["blue.400"]}>
          <Text fontSize="30">členů</Text>
          <Text fontSize="30">{members.length}</Text>
        </HStack>
        <Button onPress={onJoinPress}>Join</Button>
      </>
    );
  }
  else {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }
};

const GroupDetailsScreen = (obj) => {
  return GroupDetails(obj.route.params);
}
export default GroupDetailsScreen;
