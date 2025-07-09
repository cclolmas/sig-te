from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, AttendanceLog, OccurrenceLog, Student, Route, User, Vehicle
from google.cloud import storage
import os

operation_bp = Blueprint('operation', __name__)

# Configuração do Google Cloud Storage
# A autenticação é feita automaticamente via variáveis de ambiente (GOOGLE_APPLICATION_CREDENTIALS)
storage_client = storage.Client()
BUCKET_NAME = os.getenv('GCS_BUCKET_NAME')

@operation_bp.route('/api/my-route', methods=['GET'])
@jwt_required()
def get_my_route():
    identity = get_jwt_identity()
    user_email = identity['email'] if isinstance(identity, dict) else identity
    user = User.query.filter_by(email=user_email).first()

    if not user or user.role != 'monitor':
        return jsonify({'error': 'Unauthorized'}), 403

    route = Route.query.filter_by(monitor_id=user.id).first()
    if not route:
        return jsonify({'error': 'No route assigned'}), 404

    students = Student.query.filter_by(route_id=route.id, status='ativo').all()
    student_data = [{'id': s.id, 'name': s.full_name, 'photo_url': s.photo_url} for s in students]

    return jsonify({'route': {'id': route.id, 'name': route.name, 'students': student_data}})

@operation_bp.route('/api/attendance', methods=['POST'])
@jwt_required()
def register_attendance():
    identity = get_jwt_identity()
    user_email = identity['email'] if isinstance(identity, dict) else identity
    user = User.query.filter_by(email=user_email).first()

    if not user or user.role != 'monitor':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.json
    student_id = data.get('student_id')
    event_type = data.get('event_type')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not all([student_id, event_type, latitude, longitude]):
        return jsonify({'error': 'Missing required fields'}), 400

    route = Route.query.filter_by(monitor_id=user.id).first()
    vehicle = Vehicle.query.filter_by(route_id=route.id).first()

    attendance = AttendanceLog(
        student_id=student_id,
        route_id=route.id,
        professional_id=user.id,
        vehicle_id=vehicle.id,
        timestamp=db.func.now(),
        event_type=event_type,
        latitude=latitude,
        longitude=longitude
    )
    db.session.add(attendance)
    db.session.commit()

    return jsonify({'message': 'Attendance registered successfully'})

@operation_bp.route('/api/occurrences', methods=['POST'])
@jwt_required()
def register_occurrence():
    identity = get_jwt_identity()
    user_email = identity['email'] if isinstance(identity, dict) else identity
    user = User.query.filter_by(email=user_email).first()

    if not user or user.role != 'monitor':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.form
    occurrence_type = data.get('occurrence_type')
    description = data.get('description')
    photo = request.files.get('photo')

    if not all([occurrence_type, description]):
        return jsonify({'error': 'Missing required fields'}), 400

    route = Route.query.filter_by(monitor_id=user.id).first()

    occurrence = OccurrenceLog(
        route_id=route.id,
        professional_id=user.id,
        timestamp=db.func.now(),
        occurrence_type=occurrence_type,
        description=description,
        photo_url=None
    )

    if photo:
        try:
            if not BUCKET_NAME:
                return jsonify({'error': 'GCS_BUCKET_NAME não está configurado no servidor.'}), 500

            bucket = storage_client.bucket(BUCKET_NAME)
            blob = bucket.blob(f'occurrences/{photo.filename}')
            blob.upload_from_file(photo, content_type=photo.content_type)
            blob.make_public() # Torna o objeto publicamente legível
            occurrence.photo_url = blob.public_url
        except Exception as e:
            return jsonify({'error': f'Falha ao fazer upload da foto para o GCS: {str(e)}'}), 500

    db.session.add(occurrence)
    db.session.commit()

    return jsonify({'message': 'Occurrence registered successfully'})
