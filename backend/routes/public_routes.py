from flask import Blueprint, jsonify
from models import db, School, Student, Route, AttendanceLog
from sqlalchemy import func, extract, Date
from datetime import datetime

public_bp = Blueprint('public', __name__, url_prefix='/api/public')

@public_bp.route('/transparency-data', methods=['GET'])
def transparency_data():
    # Número total de alunos atendidos
    total_students = db.session.query(func.count(Student.id)).scalar()

    # Número de rotas ativas
    total_routes = db.session.query(func.count(Route.id)).scalar()

    # Mês corrente
    now = datetime.utcnow()
    month = now.month
    year = now.year

    # Quilometragem total rodada no mês.
    # Assumindo que o modelo Route tem um campo 'distance_km' e cada log representa uma viagem.
    # Esta é uma aproximação. Uma modelagem mais precisa teria uma tabela de 'viagens' (trips).
    total_km_query = db.session.query(func.sum(Route.distance_km)).join(
        AttendanceLog, Route.id == AttendanceLog.route_id
    ).filter(
        extract('month', AttendanceLog.timestamp) == month,
        extract('year', AttendanceLog.timestamp) == year
    )
    total_km = total_km_query.scalar() or 0

    # Taxa de ocupação média geral do mês
    # Total de embarques no mês
    total_embarques = db.session.query(func.count(AttendanceLog.id)).filter(
        extract('month', AttendanceLog.timestamp) == month,
        extract('year', AttendanceLog.timestamp) == year
    ).scalar() or 0

    # Total de viagens únicas (uma viagem é uma rota em um dia específico)
    total_viagens = db.session.query(func.count(func.distinct(AttendanceLog.route_id, func.cast(AttendanceLog.timestamp, Date)))).filter(
        extract('month', AttendanceLog.timestamp) == month,
        extract('year', AttendanceLog.timestamp) == year
    ).scalar() or 0

    # Calculando a média de passageiros por viagem, que é uma métrica mais direta.
    ocupacao_media_por_viagem = total_embarques / total_viagens if total_viagens > 0 else 0

    return jsonify({
        'total_students': total_students,
        'total_routes': total_routes,
        'total_km_month': round(total_km, 2),
        'avg_passengers_per_trip': round(ocupacao_media_por_viagem, 2),
    })
