import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from '../components/common/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import MyPageScreen from '../screens/MyPageScreen';
import MylibraryScreen from '../screens/mylibrary/MylibraryScreen';
import GroupMainScreen from '../screens/group/GroupMainScreen';
import { FlatListComponent } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator 
      tabBar={(props) => <BottomTabBar {...props} />} 
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={MylibraryScreen} />
      <Tab.Screen name="Groups" component={GroupMainScreen} />
      <Tab.Screen name="My" component={MyPageScreen} />
    </Tab.Navigator>
  );
}