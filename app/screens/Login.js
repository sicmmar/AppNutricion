import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

class Login extends Component {
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

  ingresar = () => {
    //this.props.navigation
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2021/01/27/05/43/kids-5953688_960_720.jpg",
          }}
          style={styles.image_circular}
        />

        <View style={styles.container2}>
          <TextInput
            style={styles.input}
            placeholder="No. Colegiado"
            maxLength={7}
            onChangeText={this.handleColegiado}
            keyboardType={"numeric"}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={true}
            autoCapitalize={"none"}
            autoCorrect={false}
            onChangeText={this.handlePassword}
          />
          <TouchableHighlight>
            <View style={styles.botones}>
              <Text style={styles.txtBoton}>Ingresar</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.container2}>
          <Text>¿No estás registrado?</Text>
          <TouchableHighlight onPress={this.ingresar}>
            <View style={styles.botones}>
              <Text style={styles.txtBoton}>Crea una cuenta</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default Login;

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
});
