
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Pos from './pages/Pos';
import { CarritoProvider } from './context/CarritoContext';

function PrivateRoute({ children, role }: { children: React.ReactElement; role: string }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.role_name !== role) return <Navigate to="/login" />;
  return children;
}

const App: React.FC = () => (
  <CarritoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pos" element={<PrivateRoute role="CAJERO"><Pos /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute role="ADMIN"><div>Dashboard ADMIN</div></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  </CarritoProvider>
);

export default App;
