import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppQueryProvider } from './app/providers/query-provider';
import App from './routes';
import './app/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppQueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppQueryProvider>
  </StrictMode>
);
