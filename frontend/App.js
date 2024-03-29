/**
 * @file Root of the app.
 * @authors Petr Kolouch (login logic, navigation) Vladimír Hucovič, Ondřej Zobal (navigation)
 */

import React from "react";
import { NativeBaseProvider, extendTheme, Button, Text } from "native-base";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DecksScreen from "./screens/DecksScreen";
import ArticlesScreen from "./screens/ArticlesScreen";
import DeckDetailScreen from "./screens/DeckDetailScreen";
import DeckCreateScreen from "./screens/DeckCreateScreen";
import DeckEditScreen from "./screens/DeckEditScreen";
import DeckLearnScreen from "./screens/DeckLearnScreen";
import GroupsScreen from "./screens/GroupsScreen";
import GroupDetailsScreen from "./screens/GroupDetailsScreen";
import GroupCreateScreen from "./screens/GroupCreateScreen";
import GroupUserListScreen from "./screens/GroupUserListScreen";
import GroupMarketScreen from "./screens/GroupsMarketScreen";
import GroupTestListScreen from "./screens/GroupTestListScreen";
import GroupTestDetailsScreen from "./screens/GroupTestDetailsScreen";
import CardDetailScreen from "./screens/CardDetailScreen";
import CardCreateScreen from "./screens/CardCreateScreen";
import CardEditScreen from "./screens/CardEditScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import BASE_URL from "./url";
import ArticleDetailScreen from "./screens/ArticleDetailScreen";
import CreateTranslationScreen from "./screens/CreateTranslationScreen";
import SelectionOverlay from "./components/SelectionOverlay";
import CardFromArticleWordScreen from "./screens/CardFromArticleWordScreen";
import DeckSelectScreen from "./screens/DeckSelectScreen";
import TranslationDeletionScreen from "./screens/TranslationDeletionScreen";
import CommunityTranslationScreen from "./screens/CommunityTranslationScreen";
import CreateNewArticleScreen from "./screens/CreateNewArticleScreen";


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
        await AsyncStorage.setItem("user", String(response.data.user.id));
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
        console.log(response.data.user);
        await AsyncStorage.setItem("user", String(response.data.user.id));
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
    await AsyncStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  function AuthenticatedTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Decks") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Marketplace") {
              iconName = focused ? "ios-cart" : "ios-cart-outline";
            } else if (route.name === "Groups") {
              iconName = focused ? "ios-people" : "ios-people-outline";
            } else if (route.name === "Articles") {
              iconName = focused ? "ios-document" : "ios-document-outline";
            }
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
        <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
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
            <>
              <Stack.Screen
                name="Home"
                component={AuthenticatedTabs}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
              <Stack.Screen name="DeckCreate" component={DeckCreateScreen} />
              <Stack.Screen name="DeckEdit" component={DeckEditScreen} />
              <Stack.Screen name="DeckLearn" component={DeckLearnScreen} />
              <Stack.Screen name="CardDetail" component={CardDetailScreen} />
              <Stack.Screen name="CardCreate" component={CardCreateScreen} />
              <Stack.Screen name="CardEdit" component={CardEditScreen} />
              <Stack.Screen name="GroupCreate" component={GroupCreateScreen} options={{ title: 'Group Creation' }} />
              <Stack.Screen name="GroupUserList" component={GroupUserListScreen} options={{ title: 'Members' }} />
              <Stack.Screen name="GroupMarket" component={GroupMarketScreen} options={{ title: 'Explore Learning Groups' }} />
              <Stack.Screen name="GroupTestList" component={GroupTestListScreen} options={{ title: 'Tests' }} />
              <Stack.Screen name="GroupTestDetails" component={GroupTestDetailsScreen} options={{ title: 'Test' }} />
              <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Learning Group' }}/>
              <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{title: 'Article'}} />
              <Stack.Screen name="CreateTranslation" component={CreateTranslationScreen} options={{title: 'Create a translation'}}/>
              <Stack.Screen name="SelectionMenu" component={SelectionOverlay} options={{title: 'Selection menu'}}/>
              <Stack.Screen name="AddCardToDeck" component={CardFromArticleWordScreen} options={{title: 'Add card to deck'}}/>
              <Stack.Screen name="DeckSelect" component={DeckSelectScreen} options={{title: 'Select a deck'}}/>
              <Stack.Screen name="DeleteTranslation" component={TranslationDeletionScreen} options={{title: 'Delete translations'}}/>
              <Stack.Screen name="CommunityTranslationScreen" component={CommunityTranslationScreen} options={{title: 'Community Translations'}}/>
              <Stack.Screen name="CreateNewArticleScreen" component={CreateNewArticleScreen} options={{title: 'Create an article'}}/>
            </>
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
