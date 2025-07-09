import pytest
from models import db, Route, School
from tests.conftest import clean_db, client, app

@pytest.fixture(scope='function')
def setup_school(clean_db):
    """Cria uma escola para associar às rotas."""
    school = School(name='Escola Padrão', inep_code='12345678', address='Rua Teste', contract_type='CONTRATO_03')
    db.session.add(school)
    db.session.commit()
    return school

@pytest.mark.usefixtures("setup_school")
def test_create_route_success(client):
    """Testa a criação de uma nova rota com sucesso."""
    school = School.query.first()
    payload = {
        'route_code': 'R-ASA-SUL-01',
        'turn': 'matutino',
        'school_id': school.id
    }
    resp = client.post('/api/routes/', json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data['route_code'] == 'R-ASA-SUL-01'
    assert data['school_id'] == school.id

def test_create_route_missing_data(client):
    """Testa a criação de uma rota com dados faltando."""
    payload = {'turn': 'matutino'}
    resp = client.post('/api/routes/', json=payload)
    assert resp.status_code == 400

@pytest.mark.usefixtures("clean_db")
def test_get_all_routes(client, setup_school):
    """Testa a listagem de todas as rotas."""
    route1 = Route(route_code='R01', turn='matutino', school_id=setup_school.id)
    route2 = Route(route_code='R02', turn='vespertino', school_id=setup_school.id)
    db.session.add_all([route1, route2])
    db.session.commit()

    resp = client.get('/api/routes/')
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 2

@pytest.mark.usefixtures("clean_db")
def test_update_route(client, setup_school):
    """Testa a atualização de uma rota existente."""
    route = Route(route_code='R-UPDATE', turn='matutino', school_id=setup_school.id)
    db.session.add(route)
    db.session.commit()

    update_payload = {'turn': 'integral'}
    resp = client.put(f'/api/routes/{route.id}', json=update_payload)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['turn'] == 'integral'
    assert data['route_code'] == 'R-UPDATE'