import React from "react";
import { useState } from "react";
import axios from "axios";
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

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.0.29:3000/auth/login", {
        username,
        password,
      });
      if (response.status == 200) {
        console.log("Logged In!");
        navigation.navigate("Decks", response.data);
      } else {
        console.log("Error logging in!", response.data);
      }
    } catch (error) {
      console.log("Error logging in!", error);
    }
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
            onPress={handleLogin}
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
