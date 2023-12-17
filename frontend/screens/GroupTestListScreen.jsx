/**
 * A screen for listsing given groups tests
 * @file frontend/screens/GroupTestListScreen.jsx
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
  Pressable,
  HStack,
  Icon,
  Modal, ScrollView, Input,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupsTestList = (navigation, { groupId }) => {
  const [tests, setTests] = React.useState([]);
  let [group, setGroup] = React.useState(null);
  let [userId, setUserId] = React.useState(null);

  const fetchTest = async () => {
    try {
      const fetched_user_id = await AsyncStorage.getItem("user");
      setUserId(fetched_user_id);
      const fetchedTests = await axios.get(`/groups/${groupId}/tests/?user_id=${fetched_user_id}`);
      setTests(fetchedTests.data);
      const fetched_group = (await axios.get(`/groups/${groupId}/`)).data;
      setGroup(fetched_group);
    }
    catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTest();
    }, [groupId])
  );

  const renderTest = () => {
    return (
      <ScrollView>
        {tests.map(test =>
          <Pressable mb="15px" onPress={() => navigation.navigate("GroupTestDetails", {groupId, testId: test.id})}>
          <VStack bg={"#d4d9d6"} borderRadius="lg" p="15px">
            <Text fontSize="30" key={test.id}>{test.name}</Text>
            {
              userId != group.lector_id ? ((test.questions == test.answers &&
                                            <Text>Test Completed</Text>) || (test.answers == 0 && <Text>New</Text>) || <Text>{test.answers}/{test.questions} Questions Answered</Text>) : <Box/>
            }
          </VStack>
          </Pressable>
        )}
      </ScrollView>
    );
  };

  if (!userId || !group || !tests) {
    return <Text>Loading...</Text>;
  }

  const createTestHandler = async () => {
    try {
      const newTest = {id: null, group_id: groupId, name: "New Test", difficulty: 0};
      const id = await axios.post(`/groups/${groupId}/tests/`, newTest);
      navigation.navigate("GroupTestDetails", {groupId, testId: id.data.id});
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView m="10px">
      {tests.length > 0 ?
      renderTest()
      :
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Icon mt="50%" m="10px" as={Ionicons} name="newspaper-outline" color="black" size="100" />
        <Text mt="5%" mb="5%" fontSize="30" textAlign="center">No tests have been created yet.</Text>
      </VStack>
      }
      { userId.toString() == group.lector_id &&
        <HStack flex={1} justifyContent="center" alignItems="center">
          <Button startIcon={<Icon as={Ionicons} name="add-circle-outline" color="white" size="lg" />} m="10px" onPress={() => createTestHandler()}>
            Create a new Test
          </Button>
        </HStack>
      }
    </ScrollView>
  );
};

const GroupsTestListScreen = (obj) => {
  return GroupsTestList(obj.navigation, obj.route.params);
}

export default GroupsTestListScreen;
