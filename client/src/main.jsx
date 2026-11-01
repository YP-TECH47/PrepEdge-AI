import './index.css'; // This line loads your stylesheet
import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './routes';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);