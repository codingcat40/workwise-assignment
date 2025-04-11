import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

console.log('Initializing app...');
const rootElement = document.getElementById('root');

// Debug - log if root element exists
if (rootElement) {
  console.log('Root element found');
} else {
  console.error('Root element not found!');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
