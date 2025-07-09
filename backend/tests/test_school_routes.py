import pytest
from models import db, School, ContractTypeEnum
from tests.conftest import clean_db, client, app # Import fixtures

def seed_school_data():
    school1 = School(name='Escola Teste 1', inep_code='11111111', address='Rua A', contract_type=ContractTypeEnum.CONTRATO_03.value)
    school2 = School(name='Escola Teste 2', inep_code='22222222', address='Rua B', contract_type=ContractTypeEnum.CONTRATO_04.value)
    db.session.add_all([school1, school2])
    db.session.commit()
    return [school1, school2]

@pytest.mark.usefixtures("clean_db")
def test_get_schools(client):
    seed_school_data()
    resp = client.get('/api/schools/')
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]['name'] == 'Escola Teste 1'

@pytest.mark.usefixtures("clean_db")
def test_get_school_by_id_success(client):
    schools = seed_school_data()
    school_id = schools[0].id
    resp = client.get(f'/api/schools/{school_id}')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['inep_code'] == '11111111'

@pytest.mark.usefixtures("clean_db")
def test_get_school_by_id_not_found(client):
    resp = client.get('/api/schools/9999')
    assert resp.status_code == 404

@pytest.mark.usefixtures("clean_db")
def test_create_school_success(client):
    payload = {
        'name': 'Nova Escola',
        'inep_code': '33333333',
        'address': 'Rua Nova',
        'contract_type': 'CONTRATO_03'
    }
    resp = client.post('/api/schools/', json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data['name'] == 'Nova Escola'
    assert data['inep_code'] == '33333333'

@pytest.mark.usefixtures("clean_db")
def test_create_school_invalid_contract_type(client):
    payload = {
        'name': 'Escola Inválida',
        'inep_code': '44444444',
        'address': 'Rua X',
        'contract_type': 'INVALIDO'
    }
    resp = client.post('/api/schools/', json=payload)
    assert resp.status_code == 400
    data = resp.get_json()
    assert 'INVALIDO' in data['message']

@pytest.mark.usefixtures("clean_db")
def test_school_crud_lifecycle(client):
    # 1. Criar escola
    payload = {
        'name': 'Escola CRUD',
        'inep_code': '55555555',
        'address': 'Rua CRUD',
        'contract_type': 'CONTRATO_03'
    }
    resp = client.post('/api/schools/', json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    school_id = data['id']
    assert data['name'] == 'Escola CRUD'
    assert data['inep_code'] == '55555555'

    # 2. Atualizar escola
    update_payload = {
        'name': 'Escola CRUD Editada',
        'inep_code': '55555555',
        'address': 'Rua Editada',
        'contract_type': 'CONTRATO_04'
    }
    resp = client.put(f'/api/schools/{school_id}', json=update_payload)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['name'] == 'Escola CRUD Editada'
    assert data['contract_type'] == 'CONTRATO_04'

    # 3. Buscar escola específica
    resp = client.get(f'/api/schools/{school_id}')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['name'] == 'Escola CRUD Editada'

    # 4. Excluir escola
    resp = client.delete(f'/api/schools/{school_id}')
    assert resp.status_code in (200, 204)

    # 5. Listar todas para garantir remoção
    resp = client.get('/api/schools/')
    assert resp.status_code == 200
    data = resp.get_json()
    assert all(s['id'] != school_id for s in data)
