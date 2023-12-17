/**
 * A text label component that can be edited like an input
 * after clicking on it
 * @file frontend/comopnents/EditableText.jsx
 * @author Ondřej Zobal (xzobal01)
 **/

import React from 'react';
import { Button, Icon, Text, Input, HStack, Pressable } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EditableText = ({content, onConfirm, textSize, textColor, allowEdit}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputContent, setInputContent] = React.useState(content);
  const inputRef = React.useRef(null);

  const startEdit = () => {
    if (!allowEdit) {
      return;
    }
    setIsEditing(true);
  }

  const cancelEdit = () => {
    setIsEditing(false);
    setInputContent(content);
  }

  const acceptEdit = () => {
    setIsEditing(false);
    if (!allowEdit) {
      return;
    }
    onConfirm(inputContent);
  }

  React.useEffect( () => {
  if (isEditing) {
    inputRef.current?.focus();
  }});

  return (
    <HStack>
      {isEditing ? (
        <>
          <Input
            value={inputContent}
            onChangeText={setInputContent}
            fontSize={textSize}
            color={textColor}
            ref={inputRef}
            flex={1}
          />
          <HStack space={2}>
            <Button ml="10px" onPress={() => acceptEdit()}>
              <Icon as={Ionicons} name="checkmark" color="white" size="lg" />
            </Button>
            <Button onPress={() => cancelEdit()}>
                <Icon as={Ionicons} name="close" color="white" size="lg" />
            </Button>
          </HStack>
        </>
      ) : (
        <Pressable onPress={() => startEdit()} flex={1}>
          <HStack>
          <Text fontSize={textSize} color={textColor}>
            {inputContent}
          </Text>
          {allowEdit && <Icon ml="10px" mt="10px" as={Ionicons} name="create-outline" color="black" size="md" />}
          </HStack>
        </Pressable>
      )}
    </HStack>
  );
};

export default EditableText;
