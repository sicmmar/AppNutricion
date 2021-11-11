import React from "react";
import { Image, StyleSheet, View } from "react-native";

import Product from "../screens/Product";
import Meal from "../screens/Meal";
import Recipe from "../screens/Recipe";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "../screens/Login";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Productos">
      <Tab.Screen
        name="Productos"
        component={Product}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require("../assets/icons/product.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0e7ca0" : "#748c94",
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Esquemas"
        component={Meal}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require("../assets/icons/meal.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0e7ca0" : "#748c94",
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Recetas"
        component={Recipe}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require("../assets/icons/recipe.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0e7ca0" : "#748c94",
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Inicio sesión"
        component={Login}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require("../assets/icons/login.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0e7ca0" : "#748c94",
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DAF7A6",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    padding: 37,
    alignItems: "center",
    justifyContent: "center",
  },
  image_circular: {
    height: 200,
    width: 200,
    borderRadius: 81,
  },
  botones: {
    backgroundColor: "#FFC300",
    alignItems: "center",
    padding: 10,
    borderRadius: 41,
    width: 196,
  },
  txtBoton: {
    fontSize: 19,
  },

  input: {
    margin: 15,
    width: 196,
    borderColor: "#FFC300",
    borderWidth: 1.3,
    padding: 10,
    borderRadius: 41,
    fontSize: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#DAF7A6",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
