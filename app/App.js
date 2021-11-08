import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Home from "./screens/Home";
import Product from "./screens/Product";
import Meal from "./screens/Meal";
import Recipe from "./screens/Recipe";

const Stack = createNativeStackNavigator();

export default function App() {
  return <Home />;
}
