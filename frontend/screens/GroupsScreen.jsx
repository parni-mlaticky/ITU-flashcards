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
  Modal, ScrollView, Input,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';

const GroupsPage = ({ navigation }) => {
  const groupClickHandler = (id) => {
    navigation.navigate("GroupDetails", {groupId: id});
  };

  const renderGroup = (group) => {
    return (
      <>
        <Pressable onPress={() => groupClickHandler(group.id)} mb="10">
          <Box bg={[ "red.400" ]}>
            <Text fontSize="30">{group.name}</Text>
            <Text fontSize="30">{group.description}</Text>
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
      const renderGroups = async () => {
        try {
          const data = (await axios.get("/groups/")).data;
          setGroups(data.map(entry => renderGroup(entry)));
        } catch (error) {
          console.error("Error fetching groups", error);
        }
      };
      renderGroups();
    }, [])
  );

  return (
    <>
      {groups}
      <Button onPress={() => newGroupClickHandler(true)}>Create a new Group</Button>
    </>
  );
};

export default GroupsPage;
