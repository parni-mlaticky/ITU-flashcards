import React from "react";
import { NativeBaseProvider, extendTheme, Button, Text } from "native-base";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DecksScreen from "./screens/DecksScreen";
import GroupsScreen from "./screens/GroupsScreen";
import ArticlesScreen from "./screens/ArticlesScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

import { BASE_URL } from "@env";
console.log(BASE_URL);
axios.defaults.baseURL = BASE_URL;

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  const handleLogin = async (username, password, navigation) => {
    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });
      if (response.status == 200) {
        await AsyncStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigation.navigate("Decks");
      } else {
        console.log("Error logging in!", response.data);
      }
    } catch (error) {
      console.log("Error logging in!", error);
    }
  };

  const handleRegister = async (
    username,
    password,
    confirmPassword,
    navigation,
  ) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/auth/register", {
        username,
        password,
      });

      if (response.status == 201) {
        console.log("Registered!");
        await AsyncStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigation.navigate("Decks");
      } else {
        console.log("Error registering!", response.data);
      }
    } catch (error) {
      console.log("Error registering!", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  function AuthenticatedTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Decks") {
              iconName = focused ? "ios-list-box" : "ios-list";
            } else if (route.name === "Groups") {
              iconName = focused ? "ios-people" : "ios-people-outline";
            } else if (route.name === "Articles") {
              iconName = focused ? "ios-document" : "ios-document-outline";
            }

            // You can return any component that you like here
            return <Icon name={iconName} size={size} color={color} />;
          },
          headerRight: () => (
            <Text
              onPress={handleLogout}
              style={{
                textDecorationLine: "underline",
                color: "blue",
                marginRight: 10,
              }}
            >
              Logout
            </Text>
          ),
        })}
      >
        <Tab.Screen name="Decks" component={DecksScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />
        <Tab.Screen name="Articles" component={ArticlesScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <Stack.Screen
              name="Home"
              component={AuthenticatedTabs}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen {...props} handleLogin={handleLogin} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {(props) => (
                  <RegisterScreen {...props} handleRegister={handleRegister} />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
