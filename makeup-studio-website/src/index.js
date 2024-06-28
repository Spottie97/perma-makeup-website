import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';  // Ensure this is App.css, not styles.css
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
