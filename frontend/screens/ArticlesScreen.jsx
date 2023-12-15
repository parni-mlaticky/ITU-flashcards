import React from "react";
import { useState, useEffect } from "react";
import { VStack, Box, Center, Heading, Text } from "native-base";

const ArticlesScreen = ({ navigation }) => {
  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <Heading size="lg">Articles</Heading>
        <Text>Coming soon...</Text>
      </VStack>
    </Center>
  );
};

export default ArticlesScreen;
