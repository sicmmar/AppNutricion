import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import Tabs from "../navigation/Tabs";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colegiado: "",
      pass: "",
    };
  }

  handleColegiado = (text) => {
    this.setState({ colegiado: text });
  };

  handlePassword = (text) => {
    this.setState({ pass: text });
  };

  render() {
    return (
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    );
  }
}

export default Home;
