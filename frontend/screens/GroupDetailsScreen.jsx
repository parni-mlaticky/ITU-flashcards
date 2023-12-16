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
  Input,
  Icon,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import EditableText from "../components/EditableText"

const GroupDetails = (navigation, { groupId }) => {
  let [group, setGroup] = React.useState(null);
  let [lectorName, setLectorName] = React.useState(null);
  let [members, setMembers] = React.useState([]);
  let [userId, setUserId] = React.useState(null);
  let [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  React.useEffect(() => {
    (async () => {setUserId(await AsyncStorage.getItem("user"));})();
  }, []);

  const renderGroups = async () => {
    try {
      const data = await axios.get(`/groups/${groupId}`);
      setGroup(data.data);
      const username = (await axios.get(`/users/name/${data.data.lector_id}`));
      setLectorName(username.data.username);
      const m = (await axios.get(`/groups/${groupId}/members`));
      setMembers(m.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
    renderGroups();
    }, [])
  );

  if (typeof groupId == undefined) {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }

  if (!userId) {
    return <Text fontSize="30px">Loading...</Text>;
  }

  const is_member = members.map(record => record.user_id.toString()).includes(userId);

  const onJoinPress = async () => {
    try {
      await axios.post(`/groups/${groupId}/join/`, {user_id: userId,});
      await renderGroups();
    } catch (e) {
      console.log(e);
    }
  }

  const onLeavePress = async () => {
    try {
      await axios.post(`/groups/${groupId}/leave/`, {user_id: userId,});
      await renderGroups();
    } catch (e) {
      console.log(e);
    }
  }

  const onDeletePress = async () => {
    try {
      setShowDeleteConfirmation(true);
    } catch (e) {
      console.log(e);
    }
  }

  const onDeleteConfirmPress = async () => {
    try {
      await axios.delete(`/groups/${groupId}/`);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  }

  const changeName = async (name) => {
    try {
      group.name = name;
      await axios.put(`/groups/${groupId}/`, group);
      await renderGroups();
    } catch (e) {
      console.log(e);
    }
  }

  const changeDescription = async (description) => {
    try {
      group.description = description;
      await axios.put(`/groups/${groupId}/`, group);
      await renderGroups();
    } catch (e) {
      console.log(e);
    }
  }

  const renderTopButton = () => {
    if (group.lector_id == userId) {
      if (showDeleteConfirmation) {
        return (
          <HStack width="100%">
            <HStack justifyContent="space-between" width="100%">
              <HStack>
              <Icon mt="5px" mr="10px" as={Ionicons} name="alert-circle-outline" color="black" size="lg" />
              <Text fontSize="lg" fles={1}>Are you sure?</Text>
              </HStack>
              <HStack spece={2}>
                <Button startIcon={<Icon as={Ionicons} name="checkmark" color="white" size="lg" />} mr="10px" onPress={onDeleteConfirmPress}>Yes</Button>

                <Button startIcon={<Icon as={Ionicons} name="close" color="white" size="lg" />} onPress={() => setShowDeleteConfirmation(false)}>No</Button>
              </HStack>
            </HStack>
          </HStack>
        );
      }
      else {
        return <Button onPress={onDeletePress}>Delete</Button>;
      }
    } else if (is_member){
      return <Button onPress={onLeavePress}>Leave</Button>;
    } else {
      return <Button onPress={onJoinPress}>Join</Button>;
    }
  };

  if (group) {
    return (
      <>
        <Box m="10px">
          <Box mb="20px" bg={["#d4d9d6"]} p="30px" borderRadius="lg">
              <VStack mb="20px">
                <EditableText content={group.name} onConfirm={(name) => changeName(name)} textSize={30} textColor="black"/>
                <Text fontSize="15" italic>{`taught by ${lectorName}`}</Text>
                <EditableText content={group.description} onConfirm={(name) => changeDescription(name)} textSize={20} textColor="black"/>
              </VStack>
            <HStack>
            <HStack justifyContent="space-between" alignItems="center" flex={1}>
              {showDeleteConfirmation ||
              <Box>
                <Pressable onPress={() => navigation?.navigate("GroupUserList", {group})}>
                  <HStack bg={["#a0a5a2"]} borderRadius="lg">
                    <Icon m="10px" as={Ionicons} name="people" color="black" size="lg" />
                    <Text fontSize="20">Students: </Text>
                    <Text fontSize="20">{members.length}</Text>
                    <Icon m="10px" as={Ionicons} name="chevron-forward-outline" color="black" size="lg" />
                  </HStack>
                </Pressable>
              </Box>
              }
              <Box space={1}>
                { renderTopButton() }
              </Box>
            </HStack>
            </HStack>
          </Box>
          { is_member ?
          <HStack alignItems="center" justifyContent="center">
            <Pressable onPress={() => navigation?.navigate("GroupUserList", {group})}>
              <HStack bg={["red.400"]} >
                <Icon m="10px" as={Ionicons} name="people" color="white" size="lg" />
                <Text fontSize="20">Tests: </Text>
                <Text fontSize="20">{members.length}</Text>
                <Icon m="10px" as={Ionicons} name="chevron-forward-outline" color="white" size="lg" />
              </HStack>
            </Pressable>
          </HStack>
            :
          <VStack justifyContent="center" alignItems="center">
            <Icon m="10px" as={Ionicons} name="enter-outline" color="black" size="100" />
            <Text fontSize="30" textAlign="center">Join this group to see more!</Text>
          </VStack>
          }
        </Box>
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
  return GroupDetails(obj.navigation, obj.route.params);
}
export default GroupDetailsScreen;
