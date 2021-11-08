from config import configuracion
import pyrebase

cfg = configuracion()

firebase = pyrebase.initialize_app(config=cfg.config)
