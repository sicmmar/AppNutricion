import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
#import pyrebase
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import configuracion

cfg = configuracion()
cred = credentials.Certificate("cred.json")

firebase_admin.initialize_app(cred, {
    "databaseURL" : cfg.config
})


app = Flask(__name__)
CORS(app)


@app.route('/')
def result():
    return str("Jau")


@app.route('/', methods=['POST'])
def nuevoNutri():
    dataref = db.reference("nutricionistas")
    if dataref.child(request.json.get('colegiado')).get():
        return jsonify({'mensaje': 'colegiado ya fue registrado'}), 403
    else:
        data = {
            "colegiado": request.json.get('colegiado'),
            "nombre": request.json.get('nombre'),
            "universidad": request.json.get('universidad'),
            "edad": request.json.get('edad'),
            "contrasena": request.json.get('contrasena')
        }

        dataref.child(request.json.get('colegiado')).set(data)

        return jsonify({'mensaje': 'nutricionista agregado'})


@app.route('/', methods=['PUT'])
def inicioSesion():
    dataref = db.reference("nutricionistas")
    datos = dataref.child(request.json.get('colegiado')).get()
    if datos:
        if datos['contrasena'] == request.json.get('contrasena'):
            return datos
        else:
            return jsonify({'mensaje': 'contrasenas no coinciden'}), 403
    else:
        return jsonify({'mensaje': 'colegiado no ha sido registrado'}), 404


@app.route('/producto', methods=['POST'])
def registrarProductos():
    dataref = db.reference("productos")
    if dataref.child(request.json.get('nombre')).get():
        return jsonify({'mensaje': 'producto ya fue registrado'}), 403
    else:
        data = {
            "nombre": request.json.get('nombre'),
            "clasificacion": request.json.get('clasificacion'),
            "caracteristicas": request.json.get('caracteristicas'),
            "colegiado": request.json.get('colegiado'),
            "profesional": request.json.get('profesional')
        }

        dataref.child(request.json.get('nombre')).set(data)

        return jsonify({'mensaje': 'producto agregado'})


@app.route('/producto')
def obtenerProductos():
    respuesta = []
    todosProductos = []
    referencia = db.reference("productos")
    todo = referencia.get()
    for t in todo:
        respuesta.append(t)

    for r in respuesta:
        dictionary = {'nombre' : r}
        dictionary.update(referencia.child(r).get())
        todosProductos.append(dictionary)

    return jsonify(todosProductos)


@app.route('/alimento', methods=['POST'])
def registrarAlimentos():
    dataref = db.reference("alimentos")
    if dataref.child(request.json.get('nombre')).get():
        return jsonify({'mensaje': 'alimento ya fue registrado'}), 403
    else:
        data = {
            "nombre": request.json.get('nombre'),
            "grupo": request.json.get('grupo'),
            "cantidad": request.json.get('cantidad'),
            "aporte": request.json.get('aporte'),
            "colegiado": request.json.get('colegiado'),
            "profesional": request.json.get('profesional')
        }

        dataref.child(request.json.get('nombre')).set(data)

        return jsonify({'mensaje': 'alimento agregado'})


@app.route('/alimento')
def obtenerAlimentos():
    respuesta = []
    referencia = db.reference('alimentos')
    todosAlimentos = []
    todo = referencia.get()
    for i in todo:
        respuesta.append(i)

    for r in respuesta:
        dictionary = {'nombre' : r}
        dictionary.update(referencia.child(r).get())
        todosAlimentos.append(dictionary)

    return jsonify(todosAlimentos)

@app.route('/receta', methods=['POST'])
def registrarReceta():
    dataref = db.reference("recetas")
    if dataref.child(request.json.get('nombre')).get():
        return jsonify({'mensaje': 'receta ya fue registrada'}), 403
    else:
        data = {
            "nombre": request.json.get('nombre'),
            "ingredientes": request.json.get('ingredientes'),
            "proceso": request.json.get('proceso'),
            "colegiado": request.json.get('colegiado'),
            "profesional": request.json.get('profesional')
        }

        dataref.child(request.json.get('nombre')).set(data)

        return jsonify({'mensaje': 'receta agregado'})


@app.route('/receta')
def obtenerReceta():
    respuesta = []
    referencia = db.reference('recetas')
    todosAlimentos = []
    todo = referencia.get()
    for i in todo:
        respuesta.append(i)

    for r in respuesta:
        dictionary = {'nombre' : r}
        dictionary.update(referencia.child(r).get())
        todosAlimentos.append(dictionary)

    return jsonify(todosAlimentos)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7050, use_reloader=True)
