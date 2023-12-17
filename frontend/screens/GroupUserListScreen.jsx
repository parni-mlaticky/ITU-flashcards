/**
 * A screen for listing members of a given gruop.
 * @file frontend/screens/GroupUserListSscreen.jsx
 * @author Ondřej Zobal (xzobal01)
 * */
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
  Modal,
  ScrollView,
  Input,
  Divider,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';

const GroupsUserList = (navigation, { group }) => {
  let [members, setMembers] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        // getting a list of user ids
        const entries = await axios.get(`/groups/${group.id}/members`);
        // getting of user names
        const users = entries.data.map(async entry => {
          try {
            const result = await axios.get(`/users/name/${entry.user_id}`)
            return result.data;
          } catch (e) {
            console.log(e);
          }
        });
        // awaiting all the user information
        const awaited_users = await Promise.all(users);
        setMembers(awaited_users);
      } catch(e) {
        console.log(e);
      }
    })();
  }, []);

  return (
  <ScrollView>
    <Text mb="15px" p="20px" fontSize="25">{`${group.name} has ${members.length} students:`}</Text>
    <Divider/>
    {members.map(member => (
    <Text borderRadius="lg" bg={"#d4d9d6"} p="20px" m="10px" fontSize="30" key={member.id}>{member.username}</Text>
  ))}
  </ScrollView>
  );
};

const GroupsUserListScreen = (obj) => {
  return GroupsUserList(obj.navigation, obj.route.params);
}
export default GroupsUserListScreen;
