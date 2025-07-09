import pytest
from flask import Flask
import os
import tempfile

from backend.app import create_app
from backend.models import db

@pytest.fixture(scope='session')
def app():
    # Cria um banco de dados temporário para os testes
    db_fd, db_path = tempfile.mkstemp()
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()

@pytest.fixture(scope='function')
def clean_db(app):
    """
    Fixture para limpar todas as tabelas do banco de dados após cada teste.
    Usa delete em vez de drop/create para maior performance.
    """
    with app.app_context():
        # Limpa as tabelas em ordem reversa de dependência
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        yield
