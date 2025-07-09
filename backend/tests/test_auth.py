import pytest
from models import User, db
from werkzeug.security import generate_password_hash
from tests.conftest import clean_db, client, app

@pytest.fixture(scope='function')
def setup_user(clean_db):
    """Cria um usuário de teste no banco de dados."""
    hashed_password = generate_password_hash('password123', method='pbkdf2:sha256')
    user = User(
        email='test@example.com',
        password_hash=hashed_password,
        role='gestor_escolar'
    )
    db.session.add(user)
    db.session.commit()
    return user

@pytest.mark.usefixtures("setup_user")
def test_login_success(client):
    """Testa o login bem-sucedido."""
    resp = client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'password123'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'access_token' in data

def test_login_wrong_password(client, setup_user):
    """Testa o login com a senha incorreta."""
    resp = client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'wrongpassword'})
    assert resp.status_code == 401

def test_login_nonexistent_user(client):
    """Testa o login com um usuário que não existe."""
    resp = client.post('/api/auth/login', json={'email': 'nouser@example.com', 'password': 'password123'})
    assert resp.status_code == 401

def test_login_missing_fields(client):
    """Testa o login sem um dos campos obrigatórios."""
    resp = client.post('/api/auth/login', json={'email': 'test@example.com'})
    assert resp.status_code == 400 # Assumindo que a validação retorna Bad Request