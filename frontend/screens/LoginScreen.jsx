/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: LoginScreen.jsx
 *  @brief: Screen for logging in
 */
import React from "react";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VStack,
  Box,
  Center,
  Heading,
  FormControl,
  Button,
  Text,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

const LoginScreen = ({ navigation, handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLoginPress = async () => {
    handleLogin(username, password, navigation);
  };

  return (
    <Center flex={1} px={3} bg="coolGray.50">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Login
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Welcome back!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label mb={0}>Username</FormControl.Label>
            <CustomInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label mb={0}>Password</FormControl.Label>
            <CustomInput
              placeholder="Enter your password"
              type="password"
              value={password}
              onChangeText={setPassword}
            />
          </FormControl>

          <CustomButton
            title="Login"
            mt="2"
            w="100%"
            h="40px"
            colorScheme="indigo"
            onPress={onLoginPress}
          />
          <Button
            variant="ghost"
            colorScheme="coolGray"
            onPress={() => navigation.navigate("Register")}
          >
            <Text textColor="indigo.500" underline>
              Not registered yet? Sign Up!
            </Text>
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen;
