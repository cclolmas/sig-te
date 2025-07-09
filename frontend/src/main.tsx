import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

window.addEventListener('error', (e) => {
  console.error('[QA] Erro global capturado:', e.error || e.message);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[QA] Promessa não tratada:', e.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
