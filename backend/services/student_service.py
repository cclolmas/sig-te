from ..repositories.student_repository import StudentRepository

class StudentService:
    @staticmethod
    def get_all_students(school_id=None):
        return StudentRepository.get_all(school_id)

    @staticmethod
    def get_student_by_id(student_id):
        return StudentRepository.get_by_id(student_id)

    @staticmethod
    def create_student(data):
        # Sempre cria com status 'pendente'
        data = dict(data)
        data['status'] = 'pendente'
        return StudentRepository.create(data)

    @staticmethod
    def update_student(student_id, data):
        return StudentRepository.update(student_id, data)

    @staticmethod
    def delete_student(student_id):
        return StudentRepository.delete(student_id)

    @staticmethod
    def update_student_status(student_id, status, rejection_reason=None):
        from ..models import Student
        student = Student.query.get(student_id)
        if not student:
            return None
        student.status = status
        if rejection_reason is not None:
            student.rejection_reason = rejection_reason
        db.session.commit()
        return student
