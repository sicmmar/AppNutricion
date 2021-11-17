from config import configuracion
import pyrebase
from flask import Flask, request, jsonify
from flask_cors import CORS

cfg = configuracion()

firebase = pyrebase.initialize_app(config=cfg.config)

db = firebase.database()

app = Flask(__name__)
CORS(app)


@app.route('/')
def result():
    return str("Jau")


@app.route('/', methods=['POST'])
def nuevoNutri():
    if db.child('nutricionistas').child(request.json.get('colegiado')).get().val():
        return jsonify({'mensaje': 'colegiado ya fue registrado'}), 403
    else:
        data = {
            "colegiado": request.json.get('colegiado'),
            "nombre": request.json.get('nombre'),
            "universidad": request.json.get('universidad'),
            "edad": request.json.get('edad'),
            "contrasena": request.json.get('contrasena')
        }

        db.child('nutricionistas').child(
            request.json.get('colegiado')).set(data)

        return jsonify({'mensaje': 'nutricionista agregado'})


@app.route('/', methods=['PUT'])
def inicioSesion():
    datos = db.child('nutricionistas').child(
        request.json.get('colegiado')).get().val()
    if datos:
        if datos['contrasena'] == request.json.get('contrasena'):
            return datos
        else:
            return jsonify({'mensaje': 'contrasenas no coinciden'}), 403
    else:
        return jsonify({'mensaje': 'colegiado no ha sido registrado'}), 404


@app.route('/producto', methods=['POST'])
def registrarProductos():
    if db.child('productos').child(request.json.get('nombre')).get().val():
        return jsonify({'mensaje': 'producto ya fue registrado'}), 403
    else:
        data = {
            "nombre": request.json.get('nombre'),
            "clasificacion": request.json.get('clasificacion'),
            "caracteristicas": request.json.get('caracteristicas'),
            "colegiado": request.json.get('colegiado'),
            "profesional": request.json.get('profesional')
        }

        db.child('productos').child(
            request.json.get('nombre')).set(data)

        return jsonify({'mensaje': 'producto agregado'})


@app.route('/producto')
def obtenerProductos():
    respuesta = []
    todo = db.child('productos').get()
    for t in todo.each():
        respuesta.append(t.val())

    return jsonify(respuesta)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7050, use_reloader=True)
