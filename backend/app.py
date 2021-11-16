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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7050, use_reloader=True)
