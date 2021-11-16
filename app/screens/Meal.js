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
} from "react-native";

class Meal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datos: null,
      refreshing: false,
      visible: false,
    };
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  displayModal(show) {
    this.setState({ visible: show });
  }

  _onRefresh = () => {
    console.log("refrescazo");
    this.setState({ refreshing: true });
    AsyncStorage.getItem("DATOS")
      .then((v) => {
        this.setState({ datos: JSON.parse(v) });
      })
      .then(() => {
        this.setState({ refreshing: false });
      });
  };

  refrescar = () => {
    AsyncStorage.getItem("UNIVERSIDAD").then((v) => {
      console.log("Variable de sesion: " + v);
    });
    //this.forceUpdate();
  };

  limpiarVar = () => {
    this.setState({
      colegiado: undefined,
      universidad: undefined,
    });
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
              onChangeText={(value) => this.setState({ nombre: value })}
              value={this.state.nombre}
              autoCorrect={false}
            />

            <TouchableOpacity>
              <View style={styles.botonesSec}>
                <Text style={styles.txtBoton}>Registrar</Text>
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
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              position: "absolute",
              bottom: 20,
              height: 60,
              backgroundColor: this.state.datos == null ? "#a1a2a1" : "#6d9c81",
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
          <Text>Esquemas</Text>
        </ScrollView>
      </View>
    );
  }
}

export default Meal;

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
});
