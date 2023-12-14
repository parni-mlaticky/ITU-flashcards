import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import RegisterPage from "./screens/RegisterScreen";
import LoginPage from "./screens/LoginScreen";
import DecksPage from "./screens/DecksScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const stack = createStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

function AppNavigator() {
  return (
    <stack.Navigator>
      <stack.Screen name="Login" component={LoginPage} />
      <stack.Screen name="Register" component={RegisterPage} />
      <stack.Screen name="Decks" component={DecksPage} />
    </stack.Navigator>
  );
}

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
