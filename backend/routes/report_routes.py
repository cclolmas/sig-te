from flask import Blueprint, request, send_file, Response
from datetime import datetime
from io import BytesIO, StringIO
import csv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from models import db, AttendanceLog, Route, Student

report_bp = Blueprint('report', __name__, url_prefix='/api/reports')

@report_bp.route('/monthly-frequency', methods=['GET'])
def monthly_frequency():
    month = int(request.args.get('month'))
    year = int(request.args.get('year'))
    fmt = request.args.get('format', 'pdf')

    # Buscar dados agregados de frequência por rota
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    results = db.session.query(
        Route.route_code,
        Student.full_name,
        AttendanceLog.timestamp
    ).join(AttendanceLog, AttendanceLog.route_id == Route.id)
    .join(Student, AttendanceLog.student_id == Student.id)
    .filter(AttendanceLog.timestamp >= start_date, AttendanceLog.timestamp < end_date)
    .order_by(Route.route_code, Student.full_name, AttendanceLog.timestamp).all()

    # Organizar dados por rota e estudante
    data = {}
    for route_code, student_name, timestamp in results:
        data.setdefault(route_code, {}).setdefault(student_name, []).append(timestamp.strftime('%Y-%m-%d'))

    if fmt == 'csv':
        # Gerar CSV
        si = StringIO()
        writer = csv.writer(si)
        writer.writerow(['Rota', 'Estudante', 'Datas de Presença'])
        for route, students in data.items():
            for student, dates in students.items():
                writer.writerow([route, student, ', '.join(dates)])
        output = si.getvalue()
        return Response(
            output,
            mimetype='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename=frequencia_{month:02d}_{year}.csv'
            }
        )
    else:
        # Gerar PDF
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        y = height - 40
        p.setFont('Helvetica-Bold', 14)
        p.drawString(40, y, f'Relatório de Frequência - {month:02d}/{year}')
        p.setFont('Helvetica', 10)
        y -= 30
        for route, students in data.items():
            p.drawString(40, y, f'Rota: {route}')
            y -= 18
            for student, dates in students.items():
                p.drawString(60, y, f'Estudante: {student} - Presenças: {len(dates)}')
                y -= 14
                p.drawString(80, y, f'Datas: {", ".join(dates)}')
                y -= 14
                if y < 60:
                    p.showPage()
                    y = height - 40
            y -= 10
        p.save()
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'frequencia_{month:02d}_{year}.pdf',
            mimetype='application/pdf',
        )
