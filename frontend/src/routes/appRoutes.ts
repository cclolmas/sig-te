// Arquivo novo: configuração centralizada das rotas

import React from 'react';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ExtracurricularRequestPage from '../pages/ExtracurricularRequestPage';
import ExtracurricularListPage from '../pages/ExtracurricularListPage';
import AdministrativeGuidelinesPage from '../pages/AdministrativeGuidelinesPage';
// ...importe outras páginas conforme necessário...

export const appRoutes = [
  { path: '/', element: React.createElement(HomePage) },
  { path: '/login', element: React.createElement(LoginPage) },
  { path: '/extracurriculares', element: React.createElement(ExtracurricularRequestPage) },
  { path: '/extracurriculares/lista', element: React.createElement(ExtracurricularListPage) },
  { path: '/admin/guidelines', element: React.createElement(AdministrativeGuidelinesPage) },
  // ...adicione outras rotas conforme necessário...
];
