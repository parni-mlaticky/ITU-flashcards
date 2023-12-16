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
        console.log(awaited_users);
      } catch(e) {
        console.log(e);
      }
    })();
  }, []);

  return (
  <ScrollView>
    <Text mb="15px" fontSize="20">{`${group.name} has ${members.length} students:`}</Text>
    <Divider/>
    <Box >
      {members.map(member => (
      <Text fontSize="40" key={member.id}>{member.username}</Text>
    ))}
    </Box>
  </ScrollView>
  );
};

const GroupsUserListScreen = (obj) => {
  return GroupsUserList(obj.navigation, obj.route.params);
}
export default GroupsUserListScreen;
