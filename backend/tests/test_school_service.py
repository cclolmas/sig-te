import pytest
from unittest.mock import MagicMock
from services.school_service import SchoolService
from models import School, ContractTypeEnum

class DummySchool:
    def __init__(self, name, inep_code, address, contract_type):
        self.name = name
        self.inep_code = inep_code
        self.address = address
        self.contract_type = contract_type
    def as_dict(self):
        return {
            'name': self.name,
            'inep_code': self.inep_code,
            'address': self.address,
            'contract_type': self.contract_type
        }

def test_get_all_schools():
    repo = MagicMock()
    repo.get_all.return_value = [DummySchool('A', '123', 'Rua X', 'CONTRATO_03')]
    service = SchoolService(repository=repo)
    result = service.get_all_schools()
    assert len(result) == 1
    assert result[0].name == 'A'

def test_get_school_by_id_found():
    repo = MagicMock()
    repo.get_by_id.return_value = DummySchool('B', '456', 'Rua Y', 'CONTRATO_04')
    service = SchoolService(repository=repo)
    school = service.get_school_by_id(1)
    assert school.name == 'B'

def test_get_school_by_id_not_found():
    repo = MagicMock()
    repo.get_by_id.return_value = None
    service = SchoolService(repository=repo)
    school = service.get_school_by_id(999)
    assert school is None

def test_create_school_success():
    repo = MagicMock()
    repo.add.return_value = DummySchool('C', '789', 'Rua Z', 'CONTRATO_03')
    service = SchoolService(repository=repo)
    data = {
        'name': 'C',
        'inep_code': '789',
        'address': 'Rua Z',
        'contract_type': 'CONTRATO_03'
    }
    school = service.create_school(data)
    assert school.name == 'C'
    repo.add.assert_called()

def test_create_school_invalid_contract_type():
    repo = MagicMock()
    service = SchoolService(repository=repo)
    data = {
        'name': 'D',
        'inep_code': '000',
        'address': 'Rua W',
        'contract_type': 'INVALIDO'
    }
    with pytest.raises(KeyError):
        service.create_school(data)
