import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";

import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import CardFlip from "react-native-card-flip";
const direcccion = require("../navigation/dir");

const items = [
  // this is the parent or 'item'
  {
    name: "Características Nutricionales",
    id: 11,
    // these are the children or 'sub items'
    children: [
      {
        id: 0,
        name: "Exceso de Calorías",
      },
      {
        id: 1,
        name: "Exceso de azúcares",
      },
      {
        id: 2,
        name: "Exceso grasas saturadas",
      },
      {
        id: 3,
        name: "Exceso grasas trans",
      },
      {
        id: 4,
        name: "Exceso sodio",
      },
      {
        id: 5,
        name: "Producto Genéticamente Modificado (GMO)",
      },
      {
        id: 6,
        name: "Producto No Genéticamente Modificado (NoGMO)",
      },
      {
        id: 7,
        name: "Producto orgánico",
      },
      {
        id: 8,
        name: "Libre Gluten",
      },
      {
        id: 9,
        name: "Sin azúcar añadida",
      },
      {
        id: 10,
        name: "Buena fuente de fibra",
      },
      {
        id: 11,
        name: "Alimento fortificado",
      },
    ],
  },
];

class Product extends Component {
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
        fetch("http://" + direcccion.ip + ":7050/producto", {
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
    });
  };

  obtenerCarac = (lista) => {
    return lista.map((elemento) => {
      return (
        <View style={styles.text_tags}>
          <Text
            style={{
              color: "#fdfdfd",
              flexShrink: 1,
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            {elemento.name}
          </Text>
        </View>
      );
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
                backgroundColor:
                  elemento.clasificacion == "Ultra Procesado"
                    ? "#d9724b"
                    : "#b0d94b",
              },
            ]}
          >
            <Text style={styles.label}>{elemento.nombre}</Text>
            <Text>{elemento.clasificacion}</Text>
            <Text>
              Ingresado por: [{elemento.colegiado}] {elemento.profesional}
            </Text>
            <View
              style={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignContent: "space-around",
              }}
            >
              {this.obtenerCarac(elemento.caracteristicas)}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.card, styles.card2]}
          ></TouchableOpacity>
        </CardFlip>
      );
    });
  };

  registrarProducto = () => {
    console.log("------------");
    var arr_aux = [];
    this.state.selectedItems.forEach((e) => {
      arr_aux.push(items[0].children[e]);
    });

    this.setState({ caract: arr_aux });

    if (
      this.state.nombreProd == "" ||
      this.state.clasificacion == "" ||
      this.state.clasificacion == "null" ||
      this.state.caract <= 0
    ) {
      Alert.alert("Registrar producto", "Favor llena todos los campos", [
        {
          text: "OK",
          onPress: () => {
            console.log("campos vacios");
          },
        },
      ]);
    } else {
      fetch("http://" + direcccion.ip + ":7050/producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: this.state.nombreProd,
          clasificacion: this.state.clasificacion,
          caracteristicas: this.state.caract,
          colegiado: this.state.datos.colegiado,
          profesional: this.state.datos.nombre,
        }),
      })
        .then((response) => {
          if (response.status == 403) {
            Alert.alert(
              "Registrar producto",
              "El producto ya tiene registro previo",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("producto repetido");
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
            Alert.alert("Registrar producto", "Producto Registrado", [
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
    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.visible}
        >
          <View style={styles.containerModal}>
            <Image
              source={require("../assets/icons/food.png")}
              style={styles.image}
            />

            <TextInput
              style={styles.inputModal}
              placeholder="Nombre"
              onChangeText={(value) => this.setState({ nombreProd: value })}
              value={this.state.nombreProd}
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
                selectedValue={this.state.clasificacion}
                onValueChange={(value, index) =>
                  this.setState({ clasificacion: value })
                }
              >
                <Picker.Item label="Clasificación producto" value="null" />
                <Picker.Item label="Ultra Procesado" value="Ultra Procesado" />
                <Picker.Item label="Buen Procesado" value="Buen Procesado" />
              </Picker>
            </TouchableOpacity>

            <View style={styles.inputModal}>
              <SectionedMultiSelect
                confirmText="Añadir"
                searchPlaceholderText="Escoge categorías"
                items={items}
                IconRenderer={Icon}
                uniqueKey="id"
                subKey="children"
                selectText="Categorías"
                showDropDowns={true}
                readOnlyHeadings={true}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
                showCancelButton={true}
                selectedText="seleccionado"
              />
            </View>

            <TouchableOpacity onPress={this.registrarProducto}>
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
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <ScrollView contentContainerStyle={{ padding: 25 }}>
            {this.obtenerTodo()}
          </ScrollView>
          {this.state.verBoton && (
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

export default Product;

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
    width: 100,
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
    height: 230,
    padding: 55,
  },
  card: {
    width: 320,
    height: 230,
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
