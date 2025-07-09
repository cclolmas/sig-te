# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import ENUM
import enum
from datetime import datetime

db = SQLAlchemy()

class RoleEnum(enum.Enum):
    SUPER_ADMIN = 'super_admin'
    GESTOR_ESCOLAR = 'gestor_escolar'
    MONITOR = 'monitor'
    FISCAL_GCOTE = 'fiscal_gcote'

class ContractTypeEnum(enum.Enum):
    CONTRATO_03 = 'CONTRATO_03'
    CONTRATO_04 = 'CONTRATO_04'
    INDENIZATORIO = 'INDENIZATORIO'

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(ENUM('super_admin', 'gestor_escolar', 'monitor', 'fiscal_gcote', name='user_roles'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'), nullable=True)

# School model
class School(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inep_code = db.Column(db.String(8), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(255))
    contract_type = db.Column(ENUM('CONTRATO_03', 'CONTRATO_04', 'INDENIZATORIO', name='contract_types'), nullable=False)
    students = db.relationship('Student', backref='school', lazy=True)

# Student model
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    status = db.Column(ENUM('ativo', 'inativo', 'pendente', name='student_status'), nullable=False)
    is_pcd = db.Column(db.Boolean, nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'), nullable=True)
    rejection_reason = db.Column(db.String(255), nullable=True)
    photo_url = db.Column(db.String(255), nullable=True)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.full_name,  # Map full_name to name
            'cpf': self.cpf,
            'status': self.status,
            'pcd': self.is_pcd,  # Map is_pcd to pcd
            'photo': self.photo_url,  # Map photo_url to photo
            'school_id': self.school_id,
            'route_id': self.route_id,
            'rejection_reason': self.rejection_reason
        }

# Route model
class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    route_code = db.Column(db.String(50), unique=True, nullable=False)
    turn = db.Column(ENUM('matutino', 'vespertino', name='route_turns'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'), nullable=False)

# Vehicle model
class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(10), unique=True, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(ENUM('operacional', 'manutencao', name='vehicle_status'), nullable=False)

# Professional model
class Professional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    function = db.Column(ENUM('motorista', 'monitor', name='professional_functions'), nullable=False)

class EventTypeEnum(enum.Enum):
    EMBARQUE = 'embarque'
    DESEMBARQUE = 'desembarque'

class OccurrenceTypeEnum(enum.Enum):
    MECANICA = 'mecanica'
    DISCIPLINA = 'disciplina'
    ATRASO = 'atraso'
    ACIDENTE = 'acidente'

class AttendanceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False, index=True)
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'), nullable=False, index=True)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, nullable=False, index=True)
    event_type = db.Column(ENUM('embarque', 'desembarque', name='event_types'), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

class OccurrenceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'), nullable=False, index=True)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, nullable=False, index=True)
    occurrence_type = db.Column(ENUM('mecanica', 'disciplina', 'atraso', 'acidente', name='occurrence_types'), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    photo_url = db.Column(db.String(255))

from sqlalchemy import Enum as SAEnum
import enum

class ExtracurricularStatusEnum(enum.Enum):
    PENDENTE_UNIAE = 'pendente_uniae'
    PENDENTE_GCOTE = 'pendente_gcote'
    APROVADO = 'aprovado'
    RECUSADO = 'recusado'

class ExtracurricularRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('school.id'), nullable=False, index=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    activity_name = db.Column(db.String(120), nullable=False)
    destination_address = db.Column(db.String(255), nullable=False)
    activity_date = db.Column(db.Date, nullable=False)
    departure_time = db.Column(db.Time, nullable=False)
    return_time = db.Column(db.Time, nullable=False)
    passenger_count = db.Column(db.Integer, nullable=False)
    justification = db.Column(db.Text, nullable=False)
    status = db.Column(SAEnum(ExtracurricularStatusEnum), nullable=False, default=ExtracurricularStatusEnum.PENDENTE_UNIAE)
    uniae_approver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, index=True)
    uniae_approval_timestamp = db.Column(db.DateTime, nullable=True)
    gcote_approver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, index=True)
    gcote_approval_timestamp = db.Column(db.DateTime, nullable=True)
    rejection_reason = db.Column(db.String(255), nullable=True)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)
    user = db.relationship('User', backref=db.backref('notifications', lazy=True))
