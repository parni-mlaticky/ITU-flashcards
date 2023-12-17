/**
 * A screen for showing given group's information
 * @file frontend/screens/GroupDetailsScreen.jsx
 * @author Ondřej Zobal (xzobal01)
 **/

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
  ScrollView,
  Icon,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import EditableText from "../components/EditableText"
import ConfirmationButton from "../components/ConfirmationButton"

const GroupDetails = (navigation, { groupId }) => {
  let [group, setGroup] = React.useState(null);
  let [lectorName, setLectorName] = React.useState(null);
  let [members, setMembers] = React.useState([]);
  let [tests, setTests] = React.useState([]);
  let [userId, setUserId] = React.useState(null);
  let [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  let [message, setMessage] = React.useState("");
  let [chat, setChat] = React.useState([]);
  const scrollViewRef = React.useRef();
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  React.useEffect(() => {
      if (isAtBottom) {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }
    }, [chat]);

  const renderGroups = async () => {
    try {
      const fetched_user_id = await AsyncStorage.getItem("user");
      setUserId(fetched_user_id);
      const data = await axios.get(`/groups/${groupId}`);
      setGroup(data.data);
      const username = (await axios.get(`/users/name/${data.data.lector_id}`));
      setLectorName(username.data.username);
      const m = (await axios.get(`/groups/${groupId}/members`));
      setMembers(m.data);
      const fetchedTests = await axios.get(`/groups/${groupId}/tests/?user_id=${fetched_user_id}`);
      setTests(fetchedTests.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
    renderGroups();
    }, [])
  );

  const updateChat = async () => {
    try {
      const fetched_chat = await axios.get(`/groups/${groupId}/chat`);
      if (fetched_chat != chat) {
        setChat(fetched_chat.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
  const intervalId = setInterval(() => {
      updateChat();
    }, 2500);
    updateChat();
    return () => clearInterval(intervalId);
  }, []);

  if (!groupId || !userId || !tests || !members) {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }

  const is_lector = group?.lector_id == userId;
  const is_member = is_lector || members.map(record => record.user_id.toString()).includes(userId);

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

 const checkForBottom = (event) => {
    const scroll = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const totalHeight = event.nativeEvent.layoutMeasurement.height;

    if (scroll + totalHeight + 15 >= contentHeight) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const renderTopButton = () => {
    if (group.lector_id == userId) {
      return <ConfirmationButton
               label="Delete"
               confirmationText="Are you sure?"
               onConfirm={onDeleteConfirmPress}
               showConfirmation={showDeleteConfirmation}
               setShowConfirmation={setShowDeleteConfirmation}
             />;
    } else if (is_member){
      return <Button onPress={onLeavePress}>Leave</Button>;
    } else {
      return <Button onPress={onJoinPress}>Join</Button>;
    }
  };

  let unfilled_tests = 0;
  if (!is_lector) {
    for (i in tests) {
      if(tests[i].answers < tests[i].questions) {
        unfilled_tests += 1;
      }
    }
  }
  else {
    unfilled_tests = tests.length;
  }

  if (group) {
    return (
      <>
        <Box m="10px" flex={1}>
          <Box mb="20px" bg={["#d4d9d6"]} p="30px" borderRadius="lg">
              <VStack mb="20px">
                <EditableText content={group.name} onConfirm={(name) => changeName(name)} textSize={30} textColor="black" allowEdit={is_lector}/>
                <Text fontSize="15" italic>{`taught by ${lectorName}`}</Text>
                <EditableText content={group.description} onConfirm={(name) => changeDescription(name)} textSize={20} textColor="black" allowEdit={is_lector}/>
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
          <VStack flex={1} >
            <HStack >
              <Pressable onPress={() => navigation?.navigate("GroupTestList", {groupId: group.id})} flex={1}>
                <HStack pl="10px" mb="20px" bg={["#cc8822"]} borderRadius="lg">
                  <Icon m="10px" as={Ionicons} name="newspaper-outline" color="white" size="lg" />
                  <Text color="white" fontSize="20" flex={1}>Tests </Text>
                  <Text color="white" fontSize="20">{unfilled_tests}</Text>
                  <Icon m="10px" as={Ionicons} name="chevron-forward-outline" color="white" size="lg" />
                </HStack>
              </Pressable>
            </HStack>
            <VStack bg={"#d4d9d6"} flex={1}>
              <ScrollView
                ref={scrollViewRef}
                onScroll={checkForBottom}
                p={25}
              >
                { chat.map((msg) => {
                  return <HStack>
                           <Text fontSize="20" bold>{msg.username}:   </Text>
                          <Text fontSize="20">{msg.content}</Text>
                  </HStack>;
                })}
                <Box height="30px"/>
              </ScrollView>
              <HStack>
                <Input bg="#aabbbb" borderRadius="lg" value={message} onChangeText={text => setMessage(text)} flex={1} />
                <Button bg="#779999" borderRadius="lg" onPress={ async () => {
                  try {
                    await axios.post(`/groups/${groupId}/chat`, {user_id: userId, text: message});
                    await updateChat();
                  } catch (e) {
                    console.log(e);
                  }
                  setMessage("");

                }}><Icon m="10px" as={Ionicons} name="send-outline" color="white" size="xl" /></Button>
              </HStack>
            </VStack>
          </VStack>

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
