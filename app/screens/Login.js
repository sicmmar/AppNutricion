import React, { Component } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  AsyncStorage,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import * as Crypto from "expo-crypto";

var direcccion = require("../navigation/dir");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colegiado: "",
      pass: "",
      pass2: "",
      datos: undefined,
      visible: false,
      universidad: "",
      nombre: "",
      edad: "",
    };
  }

  enviarTexto = () => {
    this.setState({
      colegiado: "",
      pass: "",
      pass2: "",
      visible: false,
      universidad: "",
      nombre: "",
      edad: "",
    });
  };

  displayModal(show) {
    this.setState({ visible: show });
  }

  alertaPositivo = () => {
    Alert.alert("Ingreso sesión", "Bienvenido " + this.state.datos.nombre, [
      {
        text: "OK",
        onPress: () => {
          console.log("Bienvenida");
          this.enviarTexto();
        },
      },
    ]);
  };

  registrar = () => {
    this.setState({ datos: undefined });
    if (
      this.state.colegiado == "" ||
      this.state.nombre == "" ||
      this.state.universidad == "" ||
      this.state.universidad == null ||
      this.state.edad == "" ||
      this.state.pass == "" ||
      this.state.pass2 == ""
    ) {
      Alert.alert("Nuevo Registro", "Ingrese todos los campos solicitados", [
        {
          text: "OK",
          onPress: () => {
            console.log("campos vacioes en registro");
          },
        },
      ]);
    } else {
      if (this.state.pass2 == this.state.pass) {
        var flag = false;
        Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA384,
          this.state.pass
        ).then((valor) => {
          this.setState({ pass: valor });
          fetch("http://" + direcccion.ip + ":7050/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              colegiado: this.state.colegiado,
              nombre: this.state.nombre,
              universidad: this.state.universidad,
              edad: this.state.edad,
              contrasena: this.state.pass,
            }),
          })
            .then((response) => {
              if (response.status == 403) {
                Alert.alert(
                  "Nuevo usuario",
                  "El número de colegiado ya ha sido registrado previamente",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        console.log("usuario existente");
                      },
                    },
                  ]
                );
              } else {
                Alert.alert("Nuevo usuario", "Registro con éxito", [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("nuevo registro exitoso");
                      this.enviarTexto();
                      flag = true;
                    },
                  },
                ]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });

        this.displayModal(flag);
      } else {
        Alert.alert("Nuevo Registro", "Las contraseñas no coinciden", [
          {
            text: "OK",
            onPress: () => {
              console.log("contrasenas distintas");
            },
          },
        ]);
      }
    }
  };

  ingresar = () => {
    this.setState({ datos: undefined });
    if (this.state.colegiado == "" || this.state.pass == "") {
      Alert.alert("Ingreso sesión", "Ingresa usuario/contraseña", [
        {
          text: "OK",
          onPress: () => {
            console.log("campos vacios");
            this.enviarTexto();
          },
        },
      ]);
    } else {
      Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA384,
        this.state.pass
      ).then((valor) => {
        this.setState({ pass: valor });
        fetch("http://" + direcccion.ip + ":7050/", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            colegiado: this.state.colegiado,
            contrasena: this.state.pass,
          }),
        })
          .then((response) => {
            if (response.status == 403) {
              Alert.alert(
                "Ingreso sesión",
                "Ingrese su contraseña correctamente",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("incorrecta contrasena");
                      this.setState({ pass: "", datos: undefined });
                    },
                  },
                ]
              );
            } else if (response.status == 404) {
              Alert.alert("Ingreso sesión", "Usuario no registrado", [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("no se ha registrado el usuario");
                    this.enviarTexto();
                  },
                },
              ]);
            } else {
              console.log("welcome");
              return response.json();
            }
          })
          .then((response) => {
            console.log(response);
            if (response != undefined) {
              this.setState({ datos: response });
              AsyncStorage.setItem("DATOS", JSON.stringify(this.state.datos));
              this.alertaPositivo();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  };

  render() {
    const { datos } = this.state;

    if (datos == undefined) {
      return (
        <View style={styles.container}>
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.visible}
          >
            <View style={styles.containerModal}>
              <Image
                source={require("../assets/icons/fruits.jpg")}
                style={styles.image}
              />
              <TextInput
                style={styles.inputModal}
                placeholder="No. Colegiado"
                maxLength={7}
                onChangeText={(value) => this.setState({ colegiado: value })}
                value={this.state.colegiado}
                keyboardType={"numeric"}
              />
              <TextInput
                style={styles.inputModal}
                placeholder="Nombre"
                onChangeText={(value) => this.setState({ nombre: value })}
                value={this.state.nombre}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={{
                  borderColor: "#f19476",
                  borderRadius: 41,
                  borderWidth: 1.3,
                  margin: 15,
                  width: 321,
                  fontSize: 19,
                  textAlign: "center",
                  marginLeft: 15,
                }}
              >
                <Picker
                  selectedValue={this.state.universidad}
                  onValueChange={(value, index) =>
                    this.setState({ universidad: value })
                  }
                >
                  <Picker.Item label="Selecciona la universidad" value="null" />
                  <Picker.Item
                    label="Universidad de San Carlos de Guatemala"
                    value="Universidad de San Carlos de Guatemala"
                  />
                  <Picker.Item
                    label="Universidad del Valle"
                    value="Universidad del Valle"
                  />
                  <Picker.Item
                    label="Universidad Francisco Marroquín"
                    value="Universidad Francisco Marroquín"
                  />
                  <Picker.Item
                    label="Universidad Mariano Gálvez"
                    value="Universidad Mariano Gálvez"
                  />
                  <Picker.Item
                    label="Universidad Da Vinci"
                    value="Universidad Da Vinci"
                  />
                  <Picker.Item
                    label="Universidad del Itsmo"
                    value="Universidad del Itsmo"
                  />
                  <Picker.Item
                    label="Universidad Mesoamericana"
                    value="Universidad Mesoamericana"
                  />
                </Picker>
              </TouchableOpacity>
              <TextInput
                style={styles.inputModal}
                placeholder="Edad"
                maxLength={2}
                onChangeText={(value) => this.setState({ edad: value })}
                value={this.state.edad}
                keyboardType={"numeric"}
              />
              <TextInput
                style={styles.inputModal}
                placeholder="Contraseña"
                secureTextEntry={true}
                autoCapitalize={"none"}
                autoCorrect={false}
                onChangeText={(value) => this.setState({ pass: value })}
                value={this.state.pass}
              />
              <TextInput
                style={styles.inputModal}
                placeholder="Confirma contraseña"
                secureTextEntry={true}
                autoCapitalize={"none"}
                autoCorrect={false}
                onChangeText={(value) => this.setState({ pass2: value })}
                value={this.state.pass2}
              />

              <TouchableOpacity onPress={this.registrar}>
                <View style={styles.botonesSec}>
                  <Text style={styles.txtBoton}>Registrar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.displayModal(!this.state.visible);
                }}
              >
                <View style={styles.inputModal}>
                  <Text style={styles.txtBoton}>Cancelar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
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
              onChangeText={(value) => this.setState({ colegiado: value })}
              value={this.state.colegiado}
              keyboardType={"numeric"}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={(value) => this.setState({ pass: value })}
              value={this.state.pass}
            />
            <TouchableOpacity onPress={this.ingresar}>
              <View style={styles.botones}>
                <Text style={styles.txtBoton}>Ingresar</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <Text>¿No estás registrado?</Text>
            <TouchableOpacity
              onPress={() => {
                this.enviarTexto();
                this.displayModal(true);
              }}
            >
              <View style={styles.botones}>
                <Text style={styles.txtBoton}>Crea una cuenta</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Image
            source={require("../assets/icons/avatar.png")}
            style={styles.image_circular}
          />
          <TextInput
            style={styles.inputModal}
            placeholder={`COLEGIADO :: ` + this.state.datos.colegiado}
            placeholderTextColor="black"
            editable={false}
          />
          <TextInput
            style={styles.inputModal}
            placeholder={`EDAD :: ` + this.state.datos.edad}
            placeholderTextColor="black"
            editable={false}
          />
          <TextInput
            style={styles.inputModal}
            placeholder={`NOMBRE :: ` + this.state.datos.nombre}
            placeholderTextColor="black"
            editable={false}
          />
          <TouchableOpacity
            onPress={() => {
              AsyncStorage.clear();
              this.setState({ datos: undefined });
            }}
          >
            <View style={styles.btn_icon}>
              <Image
                source={require("../assets/icons/logout.png")}
                style={styles.image_icon}
              />
              <Text>Salir</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
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
  containerModal: {
    flex: 1,
    backgroundColor: "#e8f8f5",
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
  image_icon: {
    height: 25,
    width: 25,
  },
  btn_icon: {
    backgroundColor: "#f19476",
    alignItems: "center",
    padding: 10,
    borderRadius: 91,
    width: 85,
  },
  botones: {
    backgroundColor: "#FFC300",
    alignItems: "center",
    padding: 10,
    borderRadius: 41,
    width: 196,
  },
  botonesSec: {
    backgroundColor: "#f19476",
    alignItems: "center",
    padding: 10,
    borderRadius: 41,
    width: 321,
  },
  txtBoton: {
    fontSize: 19,
  },
  input: {
    margin: 15,
    width: 196,
    borderColor: "#FFC300",
    borderRadius: 41,
    borderWidth: 1.3,
    padding: 10,
    fontSize: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  inputModal: {
    margin: 15,
    width: 321,
    borderColor: "#f19476",
    borderRadius: 41,
    borderWidth: 1.3,
    padding: 10,
    fontSize: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  image: {
    marginBottom: 5,
    height: 200,
    width: "100%",
  },
});
