import React from 'react';
import ReactDOM from 'react-dom/client';
import DojiScreener from './DojiScreener';
import './style.css'; // This keeps your global styles linked safely!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DojiScreener />
  </React.StrictMode>
);
