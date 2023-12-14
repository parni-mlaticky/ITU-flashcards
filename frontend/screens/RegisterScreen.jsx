import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  VStack,
  Box,
  Text,
  Center,
  Heading,
  Button,
  FormControl,
} from "native-base";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });

      if (response.status == 201) {
        console.log("Registered!");
        navigation.navigate("Decks", response.data);
      } else {
        console.log("Error registering!", response.data);
      }
    } catch (error) {
      console.log("Error registering!", error);
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
          Register
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
          Sign up to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl.Label mb={-2}>Username</FormControl.Label>
          <CustomInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <FormControl.Label mb={-2}>Password</FormControl.Label>
          <CustomInput
            placeholder="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
          />

          <FormControl.Label mb={-2}>Confirm Password</FormControl.Label>
          <CustomInput
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <CustomButton
            title="Register"
            mt="2"
            w="100%"
            h="40px"
            colorScheme="indigo"
            onPress={handleRegister}
          />

          <Button
            variant="ghost"
            colorScheme="coolGray"
            onPress={() => navigation.navigate("Login")}
          >
            <Text textColor="indigo.500" underline>
              Already registered? Sign in!
            </Text>
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default RegisterScreen;
