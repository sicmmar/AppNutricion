import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardFlip from "react-native-card-flip";

import { useIsFocused } from '@react-navigation/native';

const direcccion = require("../navigation/dir");

class Recipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datos: null,
      refreshing: false,
      visible: false,
      selectedItems: [],
      nombreProd: "",
      clasificacion: "",
      verBoton: false,
      todosDatos: [],
      tododElementos: [],
      caract: [],
      ingredientes: "",
      procedimiento: "",
      medidaprocedimiento: "unidad",
    };
  }

  displayModal(show) {
    this.setState({ visible: show });
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems: selectedItems });

    console.log(this.state.selectedItems);
  };

  _onRefresh = () => {
    console.log("refrescazo");
    this.setState({ refreshing: true, verBoton: false });
    AsyncStorage.getItem("DATOS")
      .then((v) => {
        this.setState({ datos: JSON.parse(v), verBoton: true });
        fetch("http://" + direcccion.ip + ":7050/receta", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((respuesta) => {
            return respuesta.json();
          })
          .then((respuesta) => {
            if (respuesta != null) {
              this.setState({ todosDatos: respuesta });
            }
          });
      })
      .then(() => {
        this.setState({ refreshing: false });
      });
  };

  limpiarVar = () => {
    this.setState({
      selectedItems: [],
      nombreProd: "",
      clasificacion: "",
      ingredientes: 0,
      procedimiento: 0,
      medidaprocedimiento: "unidad",
    });
  };

  obtenerTodo = () => {
    return this.state.todosDatos.map((elemento, index) => {
      return (
        <CardFlip
          key={elemento.nombre}
          style={[styles.cardContainer, { flexWrap: "wrap" }]}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.card,
              {
                backgroundColor: "#c098e5",
              },
            ]}
          >
            <Text style={styles.label}>{elemento.nombre}</Text>
                <View
                  style={{
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    alignContent: "space-around",
                  }}
                >
                  <View style={styles.text_tags}>
                    <Text
                      style={{
                        color: "#fdfdfd",
                        flexShrink: 1,
                        flexWrap: "wrap",
                        textAlign: "center",
                      }}
                    >
                      {elemento.ingredientes.toString()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    alignContent: "space-around",
                  }}
                >
                  <View style={styles.text_tags}>
                    <Text
                      style={{
                        color: "#fdfdfd",
                        flexShrink: 1,
                        flexWrap: "wrap",
                        textAlign: "center",
                      }}
                    >
                      {elemento.proceso}
                    </Text>
                  </View>
                </View>
                <Text>Ingresado por: {'[' + elemento.colegiado + '] ' + elemento.profesional}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.card, styles.card2]}
          ></TouchableOpacity>
        </CardFlip>
      );
    });
  };

  registrarAlimento = () => {
    if (
      this.state.nombreProd == "" ||
      this.state.ingredientes == "" ||
      this.state.procedimiento == ""
    ) {
      Alert.alert("Registrar receta", "Favor llena todos los campos", [
        {
          text: "OK",
          onPress: () => {
            console.log("campos vacios");
          },
        },
      ]);
    } else {
      fetch("http://" + direcccion.ip + ":7050/receta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: this.state.nombreProd,
          proceso: this.state.procedimiento.toString(),
          ingredientes: this.state.ingredientes.toString() + " " + this.state.clasificacion,
          colegiado: this.state.datos.colegiado,
          profesional: this.state.datos.nombre,
        }),
      })
        .then((response) => {
          if (response.status == 403) {
            Alert.alert(
              "Registrar receta",
              "La receta ya tiene registro previo",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("receta repetido");
                  },
                },
              ]
            );
          } else {
            return response.json();
          }
        })
        .then((response) => {
          console.log(response);
          if (response != undefined) {
            Alert.alert("Registrar receta", "Receta Registrada", [
              {
                text: "OK",
                onPress: () => {
                  this.limpiarVar();
                  this.displayModal(false);
                },
              },
            ]);
          }
        });
    }
  };

  render() {
    let boton = false;
    const { isFocused } = this.props;
    if (isFocused)
    {

      fetch("http://" + direcccion.ip + ":7050/receta", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((respuesta) => {
            return respuesta.json();
          })
          .then( async (respuesta) => {
            if (respuesta != null) {
              const value = await AsyncStorage.getItem('DATOS');
              try
              {
                if (value != null)
                {
                  this.setState({ datos: JSON.parse(value) });
                  boton = true;
                }
                else 
                {
                  this.setState({ datos: null });
                }
              }
              catch(error)
              {
                this.setState({ datos: null });
                boton = false;
              }
              this.setState({ todosDatos: respuesta });
            }
          });
    }
    
    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.visible}
        >
          <View style={styles.containerModal}>
            <Image
              source={require("../assets/icons/cook.png")}
              style={styles.image}
            />

            <TextInput
              style={styles.inputModal}
              placeholder="Nombre"
              onChangeText={(value) => this.setState({ nombreProd: value })}
              value={this.state.nombreProd}
              autoCorrect={false}
            />

            <Text>Ingredientes</Text>
            <View
              style={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignContent: "space-around",
              }}
            >
              <TextInput
                style={[styles.inputModal]}
                placeholder="Ingredientes necesarios para preparar receta ..."
                multiline
                numberOfLines={4}
                onChangeText={(value) => this.setState({ ingredientes: value })}
                value={this.state.ingredientes}
                keyboardType="text"
              />
            </View>
            <Text>Preparación</Text>
            <View
              style={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignContent: "space-around",
              }}
            >
              <TextInput
                style={[styles.inputModal]}
                placeholder="Procedimiento necesario para receta ..."
                multiline
                numberOfLines={4}
                onChangeText={(value) => this.setState({ procedimiento: value })}
                value={this.state.procedimiento}
                keyboardType="text"
              />
            </View>

            <TouchableOpacity onPress={this.registrarAlimento}>
              <View style={styles.botonesSec}>
                <Text style={styles.txtBoton}>Agregar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.displayModal(!this.state.visible);
              }}
            >
              <View>
                <Text style={styles.txtBoton}>Cancelar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <ScrollView contentContainerStyle={{ padding: 25 }}>
            {this.obtenerTodo()}
          </ScrollView>
          {this.state.datos != null && (
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                position: "absolute",
                bottom: 20,
                height: 60,
                backgroundColor:
                  this.state.datos == null ? "#a1a2a1" : "#6d9c81",
                borderRadius: 100,
              }}
              disabled={this.state.datos == null ? true : false}
              onPress={() => this.displayModal(true)}
            >
              <Image
                source={require("../assets/icons/plus.png")}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: "white",
                }}
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default function(props) {
  const isFocused = useIsFocused();

  return <Recipe {...props} isFocused={isFocused} />;
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
  containerModal: {
    flex: 1,
    backgroundColor: "#e8f8f5",
    alignItems: "center",
    justifyContent: "center",
  },
  text_tags: {
    width: 297,
    margin: 12,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a7277",
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
  botonesSec: {
    backgroundColor: "#f19476",
    alignItems: "center",
    padding: 10,
    borderRadius: 41,
    width: 321,
  },
  image: {
    marginBottom: 5,
    height: 200,
    width: "100%",
  },
  cardContainer: {
    marginBottom: 5,
    width: 320,
    height: 320,
    padding: 11,
  },
  card: {
    width: 320,
    height: 320,
    backgroundColor: "#558c60",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    padding: 15,
    marginBottom: 5,
  },
  card1: {
    backgroundColor: "#4bd969",
  },
  card2: {
    backgroundColor: "#8bb7bc",
  },
  label: {
    lineHeight: 40,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});
