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
  Icon,
  Divider,
  Modal, ScrollView, Input,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const GroupsPage = ({ navigation }) => {
  let [userId, setUserId] = React.useState(null);
  const renderGroups = async () => {
    try {
      const data = (await axios.get(`/users/groups/${userId}`)).data;
      setGroups(data.map(entry => renderGroup(entry)));
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  React.useEffect(() => {
    (async () => {setUserId(await AsyncStorage.getItem("user"));})();
  }, []);

  React.useEffect(() => {
    (async () => {await renderGroups()})();
  }, [userId]);

  const groupClickHandler = (id) => {
    navigation.navigate("GroupDetails", {groupId: id});
  };

  const renderGroup = (group) => {
    return (
      <>
        <Pressable onPress={() => groupClickHandler(group.id)} mb="10">
          <Box bg={[ "#d4d9d6" ]} p="15px" borderRadius="lg">
            <Text bold fontSize="30">{group.name}</Text>
            <Divider/>
            <Text italic fontSize="15">{group.description}</Text>
          </Box>
        </Pressable>
      </>
    );
  }

  const newGroupClickHandler = (id) => {
    navigation.navigate("GroupCreate", {groupId: id});
  };

  let [groups, setGroups] = React.useState([]);
  useFocusEffect(
    React.useCallback(() => {
      renderGroups();
    }, [userId])
  );

  return (
    <ScrollView m="10px">
      {groups}
      { groups.length > 0 ?
      <VStack>
      </VStack>
        :
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Icon mt="50%" m="10px" as={Ionicons} name="copy-outline" color="black" size="100" />
        <Text mt="5%" mb="5%" fontSize="30" textAlign="center">You are not a member of any Learning Groups yet.</Text>
      </VStack>
      }
      <HStack flex={1} justifyContent="center" alignItems="center">
        <Button startIcon={<Icon as={Ionicons} name="add-circle-outline" color="white" size="lg" />} m="10px" onPress={() => newGroupClickHandler(true)}>
          Create a new Group
        </Button>
        <Button startIcon={<Icon as={Ionicons} name="search-circle-outline" color="white" size="lg" />} m="10px" onPress={() => navigation.navigate("GroupMarket")}>
          Explore Groups
        </Button>
      </HStack>
    </ScrollView>
  );
};

export default GroupsPage;
