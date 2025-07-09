# backend/services/school_service.py
from ..models import School, ContractTypeEnum
from ..repositories.school_repository import SchoolRepository

class SchoolService:
    def __init__(self, repository=None):
        self.repository = repository or SchoolRepository

    def get_all_schools(self):
        """Retorna todas as escolas do banco de dados."""
        return self.repository.get_all()

    def get_school_by_id(self, school_id):
        """Busca uma escola pelo seu ID."""
        return self.repository.get_by_id(school_id)

    def create_school(self, data):
        """Cria uma nova escola com os dados fornecidos."""
        new_school = School(
            name=data['name'],
            inep_code=data['inep_code'],
            address=data.get('address'),
            contract_type=ContractTypeEnum[data['contract_type']]
        )
        return self.repository.add(new_school)
