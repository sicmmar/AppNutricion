import React, { Component } from "react";

import { NavigationContainer } from "@react-navigation/native";
import Tabs from "../navigation/Tabs";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    );
  }
}

export default Home;
