import pytest
from unittest.mock import patch
from flask_jwt_extended import create_access_token
from tests.conftest import clean_db, client, app

@pytest.fixture
def auth_headers():
    """Cria um token JWT para um usuário genérico e retorna os headers."""
    with app.app_context():
        token = create_access_token(identity=1)
        return {'Authorization': f'Bearer {token}'}

def test_get_report_unauthenticated(client):
    """Testa que o endpoint de relatórios requer autenticação."""
    resp = client.get('/api/reports/monthly-frequency?month=5&year=2024&format=pdf')
    assert resp.status_code == 401

@patch('services.report_service.generate_pdf_report')
def test_get_pdf_report_success(mock_generate_pdf, client, auth_headers):
    """Testa a geração de um relatório em PDF com sucesso."""
    mock_generate_pdf.return_value = b'fake-pdf-content'

    resp = client.get('/api/reports/monthly-frequency?month=5&year=2024&format=pdf', headers=auth_headers)

    assert resp.status_code == 200
    assert resp.content_type == 'application/pdf'
    assert resp.data == b'fake-pdf-content'
    mock_generate_pdf.assert_called_once_with(month=5, year=2024)

@patch('services.report_service.generate_csv_report')
def test_get_csv_report_success(mock_generate_csv, client, auth_headers):
    """Testa a geração de um relatório em CSV com sucesso."""
    mock_generate_csv.return_value = 'col1,col2\nval1,val2'

    resp = client.get('/api/reports/monthly-frequency?month=5&year=2024&format=csv', headers=auth_headers)

    assert resp.status_code == 200
    assert resp.content_type == 'text/csv; charset=utf-8'
    assert resp.data.decode('utf-8') == 'col1,col2\nval1,val2'
    mock_generate_csv.assert_called_once_with(month=5, year=2024)

def test_get_report_invalid_params(client, auth_headers):
    """Testa a requisição com parâmetros inválidos."""
    resp = client.get('/api/reports/monthly-frequency?month=99&year=2024&format=pdf', headers=auth_headers)
    assert resp.status_code == 400 # Espera-se um erro de validação