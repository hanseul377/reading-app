import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BookDetailScreen from '../screens/book/BookDetailScreen';
import OtherBookDetailScreen from '../screens/group/OtherBookDetailScreen';
import MainTabNavigator from './MainTabNavigator';
import GroupDetailScreen from '../screens/group/GroupDetailScreen';
import CreateGroupScreen from '../screens/group/CreateGroupScreen';
import LibraryDetailScreen from '../screens/mylibrary/LibraryDetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      
      <Stack.Screen name="OtherBookDetail" component={OtherBookDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="GroupDetailScreen" component={GroupDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LibraryDetailScreen" component={LibraryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetailScreen" component={BookDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}