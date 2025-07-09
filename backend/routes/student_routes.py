from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.student_service import StudentService
from ..models import User, RoleEnum

student_bp = Blueprint('student_bp', __name__, url_prefix='/api/students')

@student_bp.route('/', methods=['GET'])
@jwt_required()
def get_students():
    """
    Busca estudantes.
    - Gestores Escolares: Retorna apenas estudantes da sua escola.
    - Super Admins/Fiscais: Podem filtrar por `school_id` via query param.
      Se nenhum `school_id` for fornecido, retorna todos os estudantes.
    """
    try:
        identity = get_jwt_identity()
        user_email = identity['email'] if isinstance(identity, dict) else identity
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'error': 'Usuário não encontrado.'}), 404

        user_role = user.role
        school_id = None

        if user_role == RoleEnum.GESTOR_ESCOLAR.value:
            school_id = user.school_id
            if not school_id:
                return jsonify({'error': 'Gestor escolar não associado a uma escola.'}), 403
        elif user_role in [RoleEnum.SUPER_ADMIN.value, RoleEnum.FISCAL_GCOTE.value]:
            # Para admins, o school_id é opcional e vem do query param
            school_id = request.args.get('school_id', type=int)
        else:
            return jsonify({'error': 'Acesso negado para esta função.'}), 403

        students = StudentService.get_all_students(school_id)
        return jsonify([s.as_dict() for s in students]), 200
    except Exception as e:
        import traceback
        print('Erro ao buscar estudantes:', e)
        traceback.print_exc()
        return jsonify({'error': 'Erro interno ao buscar estudantes', 'details': str(e)}), 500

@student_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = StudentService.get_student_by_id(student_id)
    if not student:
        abort(404, description='Student not found')
    return jsonify(student.as_dict()), 200

@student_bp.route('/', methods=['POST'])
def create_student():
    data = request.get_json()
    try:
        new_student = StudentService.create_student(data)
        return jsonify(new_student.as_dict()), 201
    except Exception as e:
        abort(400, description=str(e))

@student_bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.get_json()
    try:
        updated_student = StudentService.update_student(student_id, data)
        if not updated_student:
            abort(404, description='Student not found')
        return jsonify(updated_student.as_dict()), 200
    except Exception as e:
        abort(400, description=str(e))

@student_bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    deleted = StudentService.delete_student(student_id)
    if not deleted:
        abort(404, description='Student not found')
    return '', 204

@student_bp.route('/<int:student_id>/status', methods=['PATCH'])
@jwt_required()
def update_student_status(student_id):
    data = request.get_json()
    status = data.get('status')
    rejection_reason = data.get('rejection_reason')
    # RBAC: apenas super_admin ou fiscal_gcote
    identity = get_jwt_identity()
    user_email = identity['email'] if isinstance(identity, dict) else identity
    user = User.query.filter_by(email=user_email).first()
    if not user or user.role not in ('super_admin', 'fiscal_gcote'):
        abort(403, description='Acesso negado')
    student = StudentService.update_student_status(student_id, status, rejection_reason)
    if not student:
        abort(404, description='Student not found')
    return jsonify(student.as_dict()), 200
