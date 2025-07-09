import pytest
from app import create_app
from models import db, Student, User
from services.student_service import update_student_status

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def setup_data(app):
    with app.app_context():
        super_admin = User(role='super_admin', school_id=None)
        gestor_escolar = User(role='gestor_escolar', school_id=1)
        student = Student(nome='Test Student', status='pendente', school_id=1)
        db.session.add_all([super_admin, gestor_escolar, student])
        db.session.commit()

@pytest.mark.usefixtures("setup_data")
def test_gestor_escolar_cannot_change_status(app):
    with app.app_context():
        gestor_escolar = User.query.filter_by(role='gestor_escolar').first()
        student = Student.query.first()
        result = update_student_status(student.id, 'ativo', user=gestor_escolar)
        assert result is False
        assert student.status == 'pendente'

@pytest.mark.usefixtures("setup_data")
def test_super_admin_can_change_status_to_active(app):
    with app.app_context():
        super_admin = User.query.filter_by(role='super_admin').first()
        student = Student.query.first()
        result = update_student_status(student.id, 'ativo', user=super_admin)
        assert result is True
        assert student.status == 'ativo'

@pytest.mark.usefixtures("setup_data")
def test_route_id_assignment_during_approval(app):
    with app.app_context():
        super_admin = User.query.filter_by(role='super_admin').first()
        student = Student.query.first()
        route_id = 123
        result = update_student_status(student.id, 'ativo', user=super_admin, route_id=route_id)
        assert result is True
        assert student.status == 'ativo'
        assert student.route_id == route_id
