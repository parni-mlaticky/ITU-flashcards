import React from "react";
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
          <CustomInput placeholder="Username" />

          <FormControl.Label mb={-2}>Password</FormControl.Label>
          <CustomInput placeholder="Password" type="password" />

          <FormControl.Label mb={-2}>Confirm Password</FormControl.Label>
          <CustomInput placeholder="Confirm Password" type="password" />
          <CustomButton
            title="Register"
            mt="2"
            w="100%"
            h="40px"
            colorScheme="indigo"
            onPress={() => console.log("Registered!")}
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
