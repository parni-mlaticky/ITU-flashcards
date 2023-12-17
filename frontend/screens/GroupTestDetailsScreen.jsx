/**
 * A screen for showing contents of tests.
 * @file frontend/screens/GroupTestDetailsScreen.jsx
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
  Divider,
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

const GroupTestDetails = (navigation, { groupId, testId, reviewUser }) => {
  let [userId, setUserId] = React.useState(null);
  let [test, setTest] = React.useState(null);
  let [group, setGroup] = React.useState(null);
  let [fulltextQuestions, setFulltextQuestions] = React.useState([]);
  let [fulltextAnswers, setFulltextAnswers] = React.useState({});
  let [fulltextSubmitedAnswers, setFulltextSubmitedAnswers] = React.useState({});
  let [studentsWhoAnswered, setStudentsWhoAnswered] = React.useState([]);
  let [isLector, setIsLector] = React.useState(false);

  const renderTest = async () => {
    try {
      let fetched_user_id;
      if (reviewUser === undefined) {
        fetched_user_id = await AsyncStorage.getItem("user");
      }
      else{
        fetched_user_id = reviewUser.id;
      }
      setUserId(fetched_user_id);

      const fetched_group = await axios.get(`/groups/${groupId}/`);
      setGroup(fetched_group.data);

      const fetched_test = await axios.get(`/groups/${groupId}/tests/${testId}/`);
      setTest(fetched_test.data);

      const fetched_fulltext_questions = await axios.get(`/groups/${groupId}/tests/${testId}/fulltext/`);
      setFulltextQuestions([]); // Without this the questions don't behave correctly
      setFulltextQuestions(fetched_fulltext_questions.data);

      const fetched_fulltext_answers = await axios.get(`/groups/${groupId}/tests/${testId}/fulltext/answers/${fetched_user_id}`);
      let temp = {}
      for (let key in fetched_fulltext_answers.data) {
        temp[fetched_fulltext_answers.data[key].question_id] = fetched_fulltext_answers.data[key].answer;
      }
      setFulltextSubmitedAnswers(temp);

      const is_lector = fetched_group.data.lector_id.toString() === fetched_user_id
      setIsLector(is_lector);

      if (is_lector) {
        const fetched_student_who_answered = await axios.get(`/groups/${groupId}/tests/${testId}/all`);
        setStudentsWhoAnswered(fetched_student_who_answered.data);
      }

      temp = {};
      fetched_fulltext_questions.data.map(question =>{
        temp[question.id] = "";
      });
      setFulltextAnswers(temp);
    } catch (error) {
      console.error("Error fetching test", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
    renderTest();
    }, [])
  );

  if (!group || !test || !userId || !fulltextSubmitedAnswers) {
    return <Text>Loading...</Text>;
  }

  if (typeof groupId == undefined) {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }
  if (!userId) {
    return <Text fontSize="30px">Loading...</Text>;
  }

  const changeName = async (name) => {
    try {
      test.name = name;
      await axios.put(`/groups/${groupId}/tests/${testId}`, test);
      await renderTest();
    } catch (e) {
      console.log(e);
    }
  }

  const deleteTest = async () => {
    try {
      await axios.delete(`/groups/${groupId}/tests/${testId}`);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddFulltext = async () => {
    try {
      await axios.post(`/groups/${groupId}/tests/${testId}/fulltext`, {
        id: null,
        test_id: testId,
        question: "New question",
        answer: "Answer",
        ranking: 1,
      });
      await renderTest();
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemoveFulltext = async (questionId) => {
    try {
      await axios.delete(`/groups/${groupId}/tests/${testId}/fulltext/${questionId}/`);
      //setFulltextQuestions([]);
      await renderTest();
    } catch (e) {
    }
  }

  const handleFulltextQuestionEdit = async (questionId, edit) => {
    try {
      const question = await axios.get(`/groups/${groupId}/tests/${testId}/fulltext/${questionId}/`);
      question.data.question = edit;
      await axios.put(`/groups/${groupId}/tests/${testId}/fulltext/${questionId}/`, question.data);
      await renderTest();
    } catch (e) {
    }
  }

  const handleFulltextAnswerEdit = async (questionId, edit) => {
    try {
      const question = await axios.get(`/groups/${groupId}/tests/${testId}/fulltext/${questionId}/`);
      question.data.answer = edit;
      await axios.put(`/groups/${groupId}/tests/${testId}/fulltext/${questionId}/`, question.data);
      await renderTest();
    } catch (e) {
    }
  }

  const handleSubmitTest = async () => {
    try {
      for (let key in fulltextAnswers) {
        if (!fulltextAnswers[key] || fulltextSubmitedAnswers[key]) {
          continue;
        }
        const answer = {id: null, answer: fulltextAnswers[key], user_id: userId, question_id: key };
        await axios.post(`/groups/${groupId}/tests/${testId}/fulltext/${key}/`, answer);
      }
      await renderTest();
      // navigation.goBack();
    } catch (e) {
      console.log(e)
    }
  }



  const renderQuestions = () => {
    let i = 0;
    return (
      <VStack>
        {fulltextQuestions.map(question =>{ i+=1;
          return <Box borderRadius="lg" bg={"#d4d9d6"} mb="20px" p="10px">
            <Text textSize={10} bold>Question {i}</Text>
            <VStack p="10px" mb="5px">
              <HStack>
                <Icon mt="5px" mr="5px" as={Ionicons} name="help-circle-outline" color="black" size="md" />
                <Text textSize={10} italic >Question:</Text>
              </HStack>
              <EditableText content={question.question} onConfirm={name => handleFulltextQuestionEdit(question.id, name)} textSize={20} textColor="black" allowEdit={isLector}/>
              </VStack>
              { isLector &&
              <VStack p="10px" mb="5px">
              <HStack>
                <Icon mt="5px" mr="5px" as={Ionicons} name="checkmark-circle-outline" color="black" size="md" />
                <Text textSize={10} italic >Correct answer:</Text>
              </HStack>
              <EditableText content={question.answer} onConfirm={name => handleFulltextAnswerEdit(question.id, name)} textSize={20} textColor="black" allowEdit={isLector}/>
            </VStack>
            }
            { !isLector && (fulltextSubmitedAnswers[question.id] ? (
               <>
                <VStack p="10px" mb="5px">
                  <HStack>
                    <Icon mt="5px" mr="5px" as={Ionicons} name="checkmark-circle-outline" color="black" size="md" />
                    <Text textSize={10} italic >Correct answer:</Text>
                  </HStack>
                  <Text fontSize={20}>{question.answer}</Text>
                </VStack>
                <VStack p="10px" mb="5px">
                  <HStack>
                    <Icon mt="5px" mr="5px" as={Ionicons} name="checkmark-circle-outline" color="black" size="md" />
                    <Text textSize={10} italic >Submited answer:</Text>
                  </HStack>
                  <Text color={question.answer === fulltextSubmitedAnswers[question.id] ? "#55bb55" : "#bb5555"} fontSize={20}>{fulltextSubmitedAnswers[question.id]}</Text>
                </VStack>
               </>
            ) :
              <>
                <VStack p="10px" mb="5px">
                <HStack>
                  <Icon mt="5px" mr="5px" as={Ionicons} name="checkmark-circle-outline" color="black" size="md" />
                  <Text textSize={10} italic >Write your answer:</Text>
                </HStack>
                {
                  reviewUser && <Text color="grey" italic fontSize={20}>No answer</Text> ||
                <Input mt="10px" bg="white" value={() => fulltextAnswers[question.id]} onChangeText={(text) => {
                  let temp = fulltextAnswers;
                  temp[question.id] = text;
                  setFulltextAnswers(temp);
                } }/>
                }
                </VStack>
              </>
            )}

            { isLector &&
            <ConfirmationButton label="Remove" confirmationText="Are you sure?" onConfirm={() => handleRemoveFulltext(question.id)} />
            }
          </Box>
          })}
      </VStack>
    )
  }

  const viewResult = (student) => {
    navigation.goBack();
    navigation.navigate("GroupTestDetails", {groupId, testId, reviewUser: student});
  }

  if (test) {
    return (
      <ScrollView m="10px">
        <EditableText content={test.name} onConfirm={(name) => changeName(name)} textSize={30} textColor="black" allowEdit={isLector}/>
      {reviewUser && <Text>Test results of student {reviewUser.name}</Text>}
        {
          (() => {
            if (Object.keys(fulltextQuestions).length === Object.keys(fulltextSubmitedAnswers).length) {
              let correct_total = 0;
              for (key in fulltextSubmitedAnswers) {
                const question = fulltextQuestions.find(question => question.id == key);
                if (question.answer === fulltextSubmitedAnswers[key]) {
                  correct_total += 1;
                }
              }
              return <Text bold>Test completed, correct answers: {correct_total}/{Object.keys(fulltextAnswers).length}</Text>;
            }
          })()
        }
        {isLector &&
         <Box>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
            <HStack>
              {
                studentsWhoAnswered.map(student =>
                  <Pressable onPress={() => viewResult(student)} p="15px" m="15px" borderRadius="lg" bg={"#d4d9d6"} justifyContent="center" alignItems="center">
                  <Text textAlign="center">{student.username}</Text>
                  </Pressable>
                )
              }
            </HStack>
          </ScrollView>
          <ConfirmationButton label="Delete" confirmationText="Are you sure?" onConfirm={deleteTest}/>
         </Box>
        }
        <Divider m="20px"/>
        {renderQuestions()}
        {isLector &&
          <Button startIcon={<Icon as={Ionicons} name="add-circle-outline" color="white" size="lg" />} onPress={handleAddFulltext} flex={1}>Add a Question</Button>
        }
        {!isLector && !reviewUser && (Object.keys(fulltextQuestions).length !== Object.keys(fulltextSubmitedAnswers).length) &&
         <ConfirmationButton label="Finish" onConfirm={() => handleSubmitTest()} confirmationText="Submit test?" flex={1}/>
        }
      </ScrollView>
    );
  }
  else {
    return (
      <Text fontSize="30">Loading...</Text>
    );
  }
};

const GroupTestDetailsScreen = (obj) => {
  return GroupTestDetails(obj.navigation, obj.route.params);
}
export default GroupTestDetailsScreen;
