import React from 'react';
import PropTypes from 'prop-types';

import { Button } from './Button';
import './header.css';

// Estilos migrados de index.css para uso local neste componente
const headerStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100vw',
    padding: 0,
    margin: 0,
    position: 'relative',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C326F', // var(--blue-60)
    margin: '24px 0 0 32px',
    letterSpacing: 1,
  },
  accessLink: {
    fontSize: 11,
    color: '#1351B4', // var(--blue-50)
    margin: '8px 0 0 32px',
    display: 'block',
    textDecoration: 'underline',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    gap: 18,
    margin: '32px auto 0 auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
  },
  menuLink: {
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    borderRadius: 12,
    padding: '10px 18px',
    textDecoration: 'none',
    boxShadow: '0 0 12px 2px rgba(0,0,0,0.08)',
    transition: 'transform 0.1s, box-shadow 0.1s',
    display: 'inline-block',
  },
};

export const Header = ({ user = null, onLogin, onLogout, onCreateAccount }) => (
  <header style={headerStyles.header}>
    <div>
      <div style={headerStyles.logo}>SIG-TE</div>
      <a href="/login" style={headerStyles.accessLink}>
        Acessar Plataforma
      </a>
    </div>
    <nav style={headerStyles.menu}>
      <a
        href="#painel"
        style={{
          ...headerStyles.menuLink,
          background: '#FFCD07',
          color: '#212529',
        }}
      >
        Painel de Acompanhamento das Rotas e Lotações das Frotas
      </a>
      <a
        href="#extracurricular"
        style={{
          ...headerStyles.menuLink,
          background: '#39FF14',
          color: '#212529',
        }}
      >
        Solicitação de Transporte para Atividades Extracurriculares
      </a>
      <a
        href="#reposicoes"
        style={{ ...headerStyles.menuLink, background: '#FF2EC6', color: '#fff' }}
      >
        Solicitação de Transporte para Reposições de Aulas
      </a>
      <a
        href="#estudantes"
        style={{ ...headerStyles.menuLink, background: '#B266FF', color: '#fff' }}
      >
        Inclusão ou Exclusão de Estudantes
      </a>
      <a
        href="#orientacoes"
        style={{ ...headerStyles.menuLink, background: '#FF6F91', color: '#fff' }}
      >
        Orientações Administrativas
      </a>
    </nav>
  </header>
);

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};
