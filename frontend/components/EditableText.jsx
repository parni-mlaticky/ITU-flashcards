import React from 'react';
import { Button, Icon, Text, Input, HStack, Pressable } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EditableText = ({content, onConfirm, textSize, textColor}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputContent, setInputContent] = React.useState(content);
  const inputRef = React.useRef(null);

  const startEdit = () => {
    setIsEditing(true);
  }

  const cancelEdit = () => {
    setIsEditing(false);
    setInputContent(content);
  }

  const acceptEdit = () => {
    setIsEditing(false);
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
            <Button onPress={() => acceptEdit()}>
                <Icon as={Ionicons} name="checkmark" color="white" size="lg" />
            </Button>
            <Button onPress={() => cancelEdit()}>
                <Icon as={Ionicons} name="close" color="white" size="lg" />
            </Button>
          </HStack>
        </>
      ) : (
        <Pressable onPress={() => startEdit()} flex={1}>
          <Text fontSize={textSize} color={textColor}>
            {inputContent}
          </Text>
        </Pressable>
      )}
    </HStack>
  );
};

export default EditableText;
