import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SiteContentProvider } from './context/SiteContentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SiteContentProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </SiteContentProvider>
);
