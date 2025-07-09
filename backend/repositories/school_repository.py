# backend/repositories/school_repository.py
from ..models import db, School

class SchoolRepository:
    @staticmethod
    def get_all():
        return School.query.order_by(School.name).all()

    @staticmethod
    def get_by_id(school_id):
        return School.query.get(school_id)

    @staticmethod
    def add(school):
        db.session.add(school)
        db.session.commit()
        return school
