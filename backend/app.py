# backend/app.py
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from config import Config
from werkzeug.security import generate_password_hash
from models import db, User, School, ContractTypeEnum, RoleEnum
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_routes
from routes.dashboard_routes import bp as dashboard_bp
from routes.notifications_routes import notifications_bp
from routes.public_routes import public_bp
from apispec import APISpec
from apispec_webframeworks.flask import FlaskPlugin
from flask_swagger_ui import get_swaggerui_blueprint
import os

# Inicialização da aplicação Flask
app = Flask(__name__)
app.config.from_object(Config)

# Configuração do CORS para permitir requisições do frontend React em desenvolvimento
# Isso é crucial para que a Single-Page Application (SPA) possa consumir a API.
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Update to match the correct frontend port
    "http://127.0.0.1:3000"  # Update to match the correct frontend port
], supports_credentials=True)  # Permitir requisições do frontend React

# Inicializa o SQLAlchemy e o Flask-Migrate
db.init_app(app)
migrate = Migrate(app, db) # Inicializa o Flask-Migrate

# Configuração do JWT
jwt = JWTManager(app) # A chave secreta é carregada a partir do objeto Config

# Configuração do APISpec
spec = APISpec(
    title="SIG-TE API",
    version="1.0.0",
    openapi_version="3.0.3",
    plugins=[FlaskPlugin()],
)

@app.route('/api/health')
def health_check():
    """Endpoint para verificar se o backend está funcionando."""
    return {"status": "ok"}, 200

@app.route('/api/docs/openapi.json')
def openapi_json():
    """Endpoint para servir o documento OpenAPI."""
    return spec.to_dict()

SWAGGER_URL = '/api/docs'
API_URL = '/api/docs/openapi.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "SIG-TE API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

from routes.school_routes import school_bp
from routes.student_routes import student_bp
from routes.report_routes import report_bp
from routes.extracurricular_routes import extracurricular_bp

app.register_blueprint(school_bp)
app.register_blueprint(student_bp)
app.register_blueprint(report_bp)
# Registro do blueprint de autenticação
app.register_blueprint(auth_routes)
app.register_blueprint(dashboard_bp)
app.register_blueprint(extracurricular_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(public_bp)

@app.cli.command("seed_db")
def seed_db():
    """Popula o banco de dados com dados iniciais essenciais."""
    # Usuário super_admin
    if not User.query.filter_by(email="admin@sigte.com").first():
        super_admin = User(
            email="admin@sigte.com",
            password_hash=generate_password_hash("admin123"),
            role=RoleEnum.SUPER_ADMIN.value
        )
        db.session.add(super_admin)

    # Escolas de exemplo
    escolas = [
        {"name": "Escola Classe 01 do Plano Piloto", "inep_code": "53000123", "address": "SQN 102, Asa Norte", "contract_type": ContractTypeEnum.CONTRATO_03.value},
        {"name": "Centro de Ensino Fundamental 02", "inep_code": "53000456", "address": "SQS 308, Asa Sul", "contract_type": ContractTypeEnum.CONTRATO_04.value},
        {"name": "Escola Parque da Natureza", "inep_code": "53000789", "address": "Parque da Cidade", "contract_type": ContractTypeEnum.INDENIZATORIO.value},
    ]
    for esc in escolas:
        if not School.query.filter_by(inep_code=esc["inep_code"]).first():
            school = School(**esc)
            db.session.add(school)

    db.session.commit()
    print("Banco de dados populado com dados iniciais!")

# Serve arquivos estáticos do React em rotas não-API
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    static_folder = os.path.join(app.root_path, 'static')
    file_path = os.path.join(static_folder, path)
    if path and os.path.exists(file_path):
        return send_from_directory(static_folder, path)
    return send_from_directory(static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
