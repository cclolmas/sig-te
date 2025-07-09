from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ExtracurricularRequest, ExtracurricularStatusEnum, User, Notification
from datetime import datetime

extracurricular_bp = Blueprint('extracurricular', __name__, url_prefix='/api/extracurricular-requests')

# Helper para pegar o usuário atual

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

@extracurricular_bp.route('', methods=['POST'])
@jwt_required()
def create_request():
    user = get_current_user()
    data = request.json
    req = ExtracurricularRequest(
        school_id=user.school_id,
        requester_id=user.id,
        activity_name=data['activity_name'],
        destination_address=data['destination_address'],
        activity_date=datetime.strptime(data['activity_date'], '%Y-%m-%d').date(),
        departure_time=datetime.strptime(data['departure_time'], '%H:%M').time(),
        return_time=datetime.strptime(data['return_time'], '%H:%M').time(),
        passenger_count=data['passenger_count'],
        justification=data['justification'],
        status=ExtracurricularStatusEnum.PENDENTE_UNIAE
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({'id': req.id}), 201

@extracurricular_bp.route('', methods=['GET'])
@jwt_required()
def list_requests():
    user = get_current_user()
    if user.role == 'gestor_escolar':
        requests = ExtracurricularRequest.query.filter_by(requester_id=user.id).all()
    else:
        requests = ExtracurricularRequest.query.all()
    return jsonify([
        {
            'id': r.id,
            'activity_name': r.activity_name,
            'destination_address': r.destination_address,
            'activity_date': r.activity_date.isoformat(),
            'departure_time': r.departure_time.strftime('%H:%M'),
            'return_time': r.return_time.strftime('%H:%M'),
            'passenger_count': r.passenger_count,
            'justification': r.justification,
            'status': r.status.value,
            'rejection_reason': r.rejection_reason
        } for r in requests
    ])

@extracurricular_bp.route('/<int:req_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_request(req_id):
    user = get_current_user()
    req = ExtracurricularRequest.query.get_or_404(req_id)
    now = datetime.utcnow()
    notification = None
    if user.role == 'super_admin':
        if req.status == ExtracurricularStatusEnum.PENDENTE_UNIAE:
            req.status = ExtracurricularStatusEnum.PENDENTE_GCOTE
            req.uniae_approver_id = user.id
            req.uniae_approval_timestamp = now
            # Notifica GCOTE
            gcote_users = User.query.filter_by(role='fiscal_gcote').all()
            for gcote in gcote_users:
                notification = Notification(user_id=gcote.id, message=f'Nova solicitação extracurricular pendente para GCOTE: {req.activity_name}')
                db.session.add(notification)
    elif user.role == 'fiscal_gcote':
        if req.status == ExtracurricularStatusEnum.PENDENTE_GCOTE:
            req.status = ExtracurricularStatusEnum.APROVADO
            req.gcote_approver_id = user.id
            req.gcote_approval_timestamp = now
            # Notifica gestor escolar
            requester = User.query.get(req.requester_id)
            if requester:
                notification = Notification(user_id=requester.id, message=f'Sua solicitação extracurricular "{req.activity_name}" foi aprovada.')
                db.session.add(notification)
    else:
        return jsonify({'error': 'Acesso negado'}), 403
    db.session.commit()
    return jsonify({'status': req.status.value})
