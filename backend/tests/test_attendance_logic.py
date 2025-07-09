import pytest
from flask import Flask
from backend.models import AttendanceLog, Student, Route, User
from backend.app import create_app, db

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def setup_data(app):
    with app.app_context():
        monitor = User(id=1, role='monitor', route_id=1)
        route = Route(id=1, name='Route 1')
        student = Student(id=1, name='Student 1', route_id=1)
        db.session.add_all([monitor, route, student])
        db.session.commit()

@pytest.mark.usefixtures("setup_data")
def test_create_attendance_log(client):
    response = client.post('/api/attendance', json={
        'student_id': 1,
        'latitude': -23.5505,
        'longitude': -46.6333
    }, headers={
        'Authorization': 'Bearer valid_monitor_token'
    })

    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Attendance registered successfully.'

@pytest.mark.usefixtures("setup_data")
def test_attendance_for_non_route_student(client):
    response = client.post('/api/attendance', json={
        'student_id': 2,  # Student not in monitor's route
        'latitude': -23.5505,
        'longitude': -46.6333
    }, headers={
        'Authorization': 'Bearer valid_monitor_token'
    })

    assert response.status_code == 403
    data = response.get_json()
    assert data['message'] == 'Student does not belong to your route.'
