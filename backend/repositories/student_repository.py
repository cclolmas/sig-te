from ..models import db, Student

class StudentRepository:
    @staticmethod
    def get_all(school_id=None):
        if school_id:
            return Student.query.filter_by(school_id=school_id).all()
        return Student.query.all()

    @staticmethod
    def get_by_id(student_id):
        return Student.query.get(student_id)

    @staticmethod
    def create(data):
        student = Student(**data)
        db.session.add(student)
        db.session.commit()
        return student

    @staticmethod
    def update(student_id, data):
        student = Student.query.get(student_id)
        if not student:
            return None
        for key, value in data.items():
            setattr(student, key, value)
        db.session.commit()
        return student

    @staticmethod
    def delete(student_id):
        student = Student.query.get(student_id)
        if not student:
            return False
        db.session.delete(student)
        db.session.commit()
        return True
