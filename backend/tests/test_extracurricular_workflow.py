import pytest
from app import app, db
from models import User, ExtracurricularRequest, ExtracurricularStatusEnum, RoleEnum
from flask_jwt_extended import create_access_token
from datetime import date, time

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def create_user(email, role, school_id=None):
    user = User(email=email, password_hash='hash', role=role)
    if school_id:
        user.school_id = school_id
    db.session.add(user)
    db.session.commit()
    return user

def auth_header(user):
    token = create_access_token(identity=user.id)
    return {'Authorization': f'Bearer {token}'}

def create_request(client, user):
    data = {
        'activity_name': 'Passeio',
        'destination_address': 'Parque',
        'activity_date': date.today().isoformat(),
        'departure_time': '08:00',
        'return_time': '12:00',
        'passenger_count': 10,
        'justification': 'Atividade pedagógica'
    }
    resp = client.post('/api/extracurricular-requests', json=data, headers=auth_header(user))
    return resp

def test_extracurricular_workflow(client):
    # Criação dos usuários
    gestor = create_user('gestor@escola.com', RoleEnum.GESTOR_ESCOLAR.value)
    super_admin = create_user('admin@sigte.com', RoleEnum.SUPER_ADMIN.value)
    fiscal = create_user('fiscal@gcote.com', RoleEnum.FISCAL_GCOTE.value)

    # Gestor cria solicitação
    resp = create_request(client, gestor)
    assert resp.status_code == 201
    req_id = resp.get_json()['id']
    req = ExtracurricularRequest.query.get(req_id)
    assert req.status == ExtracurricularStatusEnum.PENDENTE_UNIAE

    # UNIAE aprova
    resp = client.patch(f'/api/extracurricular-requests/{req_id}/approve', headers=auth_header(super_admin))
    assert resp.status_code == 200
    req = ExtracurricularRequest.query.get(req_id)
    assert req.status == ExtracurricularStatusEnum.PENDENTE_GCOTE

    # GCOTE aprova
    resp = client.patch(f'/api/extracurricular-requests/{req_id}/approve', headers=auth_header(fiscal))
    assert resp.status_code == 200
    req = ExtracurricularRequest.query.get(req_id)
    assert req.status == ExtracurricularStatusEnum.APROVADO

    # Teste recusa UNIAE
    req2 = ExtracurricularRequest(
        school_id=1, requester_id=gestor.id, activity_name='Recusa1', destination_address='X',
        activity_date=date.today(), departure_time=time(8,0), return_time=time(12,0),
        passenger_count=5, justification='Teste', status=ExtracurricularStatusEnum.PENDENTE_UNIAE
    )
    db.session.add(req2)
    db.session.commit()
    resp = client.patch(f'/api/extracurricular-requests/{req2.id}/reject', json={'reason': 'Faltam documentos'}, headers=auth_header(super_admin))
    assert resp.status_code == 200
    req2 = ExtracurricularRequest.query.get(req2.id)
    assert req2.status == ExtracurricularStatusEnum.RECUSADO

    # Teste recusa GCOTE
    req3 = ExtracurricularRequest(
        school_id=1, requester_id=gestor.id, activity_name='Recusa2', destination_address='Y',
        activity_date=date.today(), departure_time=time(8,0), return_time=time(12,0),
        passenger_count=5, justification='Teste', status=ExtracurricularStatusEnum.PENDENTE_GCOTE
    )
    db.session.add(req3)
    db.session.commit()
    resp = client.patch(f'/api/extracurricular-requests/{req3.id}/reject', json={'reason': 'Motivo GCOTE'}, headers=auth_header(fiscal))
    assert resp.status_code == 200
    req3 = ExtracurricularRequest.query.get(req3.id)
    assert req3.status == ExtracurricularStatusEnum.RECUSADO
