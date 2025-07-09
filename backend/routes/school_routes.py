# backend/routes/school_routes.py
from flask import Blueprint, request, jsonify, abort
from ..services.school_service import SchoolService
from ..schemas import school_schema

# O url_prefix economiza digitação, todas as rotas aqui começarão com /api/schools
school_bp = Blueprint('school_bp', __name__, url_prefix='/api/schools')

@school_bp.route('/', methods=['GET'])
def get_schools():
    """
    ---
    get:
      summary: Lista todas as escolas
      description: Retorna uma lista de todas as escolas cadastradas
      responses:
        200:
          description: Lista de escolas
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
    """
    schools = SchoolService.get_all_schools()
    return jsonify([school.as_dict() for school in schools]), 200

@school_bp.route('/<int:school_id>', methods=['GET'])
def get_school(school_id):
    """
    ---
    get:
      summary: Busca uma escola por ID
      parameters:
        - in: path
          name: school_id
          schema:
            type: integer
          required: true
          description: ID da escola
      responses:
        200:
          description: Escola encontrada
        404:
          description: Escola não encontrada
    """
    school = SchoolService.get_school_by_id(school_id)
    if not school:
        abort(404, description='School not found')
    return jsonify(school.as_dict()), 200

@school_bp.route('/', methods=['POST'])
def create_school():
    """
    ---
    post:
      summary: Cria uma nova escola
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        201:
          description: Escola criada
        400:
          description: Erro de validação
    """
    data = request.get_json()
    errors = school_schema.validate(data)
    if errors:
        return jsonify({'errors': errors}), 400
    try:
        new_school = SchoolService.create_school(data)
        return jsonify(new_school.as_dict()), 201
    except Exception as e:
        abort(400, description=str(e))

@school_bp.route('/<int:school_id>', methods=['PUT'])
def update_school(school_id):
    """
    ---
    put:
      summary: Atualiza uma escola existente
      parameters:
        - in: path
          name: school_id
          schema:
            type: integer
          required: true
          description: ID da escola
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        200:
          description: Escola atualizada
        400:
          description: Erro de validação
        404:
          description: Escola não encontrada
    """
    data = request.get_json()
    errors = school_schema.validate(data)
    if errors:
        return jsonify({'errors': errors}), 400
    try:
        updated_school = SchoolService.update_school(school_id, data)
        if not updated_school:
            abort(404, description='School not found')
        return jsonify(updated_school.as_dict()), 200
    except Exception as e:
        abort(400, description=str(e))
