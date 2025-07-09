import pytest
from flask import Flask
from backend.app import app as flask_app

@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client

def get_token(client, username, password):
    response = client.post('/api/auth/login', json={"username": username, "password": password})
    return response.get_json().get("access_token")

def test_unauthenticated_access_to_protected_endpoint(client):
    resp = client.get('/api/schools')
    assert resp.status_code == 401
    assert b"Unauthorized" in resp.data or b"Missing" in resp.data

def test_gestor_escolar_access_admin_dashboard(client):
    # Autentica como gestor_escolar
    token = get_token(client, "gestor_escolar", "testpassword")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get('/api/dashboard/kpis', headers=headers)
    assert resp.status_code == 403
    assert b"Forbidden" in resp.data or b"permission" in resp.data

def test_public_transparency_no_pii(client):
    resp = client.get('/api/public/transparency-data')
    assert resp.status_code == 200
    data = resp.get_json()
    # Recursivamente verifica se há campos sensíveis
    def contains_pii(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k.lower() in ["cpf", "name", "student_cpf", "professional_name"]:
                    return True
                if contains_pii(v):
                    return True
        elif isinstance(obj, list):
            for item in obj:
                if contains_pii(item):
                    return True
        return False
    assert not contains_pii(data), "PII encontrado na resposta do endpoint público!"
