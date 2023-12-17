/**
 * A button component that asks for confirmation before runngin
 * a given callback
 * @file frontend/components/ComfirmationButton.jsx
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
  Icon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

const ConfirmationButton = ({ label, confirmationText, onConfirm, showConfirmation, setShowConfirmation }) => {
  // Use local state if external state is not provided
  const [localShowDeleteConfirmation, setLocalShowDeleteConfirmation] = React.useState(false);

  const showDeleteConfirmation = showConfirmation !== undefined ? showConfirmation : localShowDeleteConfirmation;
  const setShowDeleteConfirmation = setShowConfirmation !== undefined ? setShowConfirmation : setLocalShowDeleteConfirmation;

  if (!showDeleteConfirmation) {
    return <Button onPress={() => setShowDeleteConfirmation(true)}>{label}</Button>;
  }
  return (
   <HStack >
   <HStack justifyContent="space-between" width="100%">
     <HStack>
       <Icon mt="5px" mr="10px" as={Ionicons} name="alert-circle-outline" color="black" size="lg" />
       <Text fontSize="lg" fles={1}>{confirmationText}</Text>
     </HStack>
     <HStack spece={2}>
       <Button startIcon={<Icon as={Ionicons} name="checkmark" color="white" size="lg" />} mr="10px" onPress={onConfirm}>Yes</Button>
       <Button startIcon={<Icon as={Ionicons} name="close" color="white" size="lg" />} onPress={() => setShowDeleteConfirmation(false)}>No</Button>
     </HStack>
     </HStack>
    </HStack>
  );
}

export default ConfirmationButton;
