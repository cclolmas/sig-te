from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User
from werkzeug.security import check_password_hash

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    if not email.endswith('@edu.se.df.gov.br'):
        return jsonify({'error': 'Só é permitido login com email institucional (@edu.se.df.gov.br)'}), 403

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Credenciais inválidas'}), 401

    # Criar uma identidade rica com informações úteis para o frontend e outras rotas
    identity = {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'school_id': user.school_id
    }
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token, user=identity), 200
