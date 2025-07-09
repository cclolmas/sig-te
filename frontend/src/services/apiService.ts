import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useQuery } from '@tanstack/react-query';

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Função utilitária para tratamento de erros
function handleApiError(error: any, defaultMsg = 'Erro na requisição') {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMsg);
}

export async function getSchools() {
  try {
    const response = await api.get('/schools');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar escolas');
  }
}

export async function createSchool(schoolData: Record<string, any>) {
  try {
    const response = await api.post('/schools', schoolData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao criar escola');
  }
}

export async function updateSchool(id: number, schoolData: Record<string, any>) {
  try {
    const response = await api.put(`/schools/${id}`, schoolData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao atualizar escola');
  }
}

export async function deleteSchool(id: number) {
  try {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao deletar escola');
  }
}

export async function getStudents(schoolId?: number | string | null) {
  try {
    const url = schoolId ? `/students?school_id=${schoolId}` : '/students';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar estudantes');
  }
}

export async function createStudent(studentData: Record<string, any>) {
  try {
    const response = await api.post('/students', studentData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao criar estudante');
  }
}

export async function getAllStudents() {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar todos os estudantes');
  }
}

export async function updateStudentStatus(
  studentId: number,
  status: string,
  reason: string | null = null,
  routeId?: number | null
) {
  try {
    console.info('[QA] Atualizando status do estudante:', { studentId, status, reason, routeId });
    const response = await api.patch(`/students/${studentId}/status`, { status, reason, route_id: routeId });
    return response.data;
  } catch (error) {
    console.error('[QA] Erro ao atualizar status do estudante:', error);
    handleApiError(error, 'Erro ao atualizar status do estudante');
  }
}

// Unifique o uso do axios instance para garantir o envio do token
export const getDashboardKpis = async () => {
  try {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar KPIs do dashboard');
  }
};

/**
 * Busca todas as rotas disponíveis.
 * @returns Lista de rotas
 */
export async function getRoutes() {
  try {
    const response = await api.get('/routes');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar rotas');
  }
}

/**
 * Hook customizado para buscar rotas.
 * @returns { data, isLoading, error }
 * @example
 * const { data, isLoading } = useRoutes();
 */
export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes,
  });
}

export async function getMyRoute() {
  try {
    const response = await api.get('/routes/my');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar minha rota');
  }
}

export async function postAttendance(data: { student_id: string; latitude: number; longitude: number }) {
  try {
    const response = await api.post('/attendance', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao registrar presença');
  }
}

// Use sempre a instância do axios configurada
export const getBuses = async () => {
  try {
    const response = await api.get('/buses');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao buscar ônibus');
  }
};

// Consolide todas as chamadas de API neste arquivo

/**
 * Realiza login do usuário.
 * @param email - E-mail do usuário
 * @param password - Senha do usuário
 * @returns Dados do usuário autenticado
 * @throws {Error} Se a autenticação falhar
 */
export async function login(email: string, password: string) {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erro ao autenticar');
  }
}

export function useStudents(schoolId?: number | string | null) {
  return useQuery({
    queryKey: ['students', schoolId],
    queryFn: () => getStudents(schoolId),
  });
}

// Remova dados mockados dos componentes e centralize mocks em /frontend/src/mocks/

// Exemplo de uso condicional de mocks:
export function useRoutesWithMock() {
  const isTest = process.env.NODE_ENV === 'test';
  if (isTest) {
    // Importação dinâmica para evitar bundle em produção
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MOCK_ROUTES } = require('../mocks/routes');
    return { data: MOCK_ROUTES, isLoading: false, error: null };
  }
  return useRoutes();
}

// ...adicione outros hooks customizados conforme necessário, por exemplo:
// export function useDashboardKpis() { return useQuery(['dashboardKpis'], getDashboardKpis); }

// ...adicione funções para outros endpoints do backend seguindo o mesmo padrão...

// Todas as funções devem tratar erros e retornar dados de forma consistente.
