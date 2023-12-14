import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DecksScreen from "./screens/DecksScreen";
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
      <stack.Screen name="Login" component={LoginScreen} />
      <stack.Screen name="Register" component={RegisterScreen} />
      <stack.Screen name="Decks" component={DecksScreen} />
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
