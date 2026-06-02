// src/navigation/AppNavigator.js

import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import AddBookScreen from '../screens/AddBookScreen';
import EditBookScreen from '../screens/EditBookScreen';
import MyBooksScreen from '../screens/MyBooksScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para a aba Home (listagem + detalhe)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}

// Stack para Meus Livros (lista + adicionar + editar)
function MyBooksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyBooksList" component={MyBooksScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="EditBook" component={EditBookScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#072a47',
            borderTopColor: '#0e4272',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#e94560',
          tabBarInactiveTintColor: '#5a9fd4',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Meus Livros') iconName = focused ? 'book' : 'book-outline';
            else if (route.name === 'Trocas') iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
            else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Início" component={HomeStack} />
        <Tab.Screen name="Meus Livros" component={MyBooksStack} />
        <Tab.Screen name="Trocas" component={RequestsScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
