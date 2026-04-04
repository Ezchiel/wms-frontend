import type React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import PublicRoute from './components/common/PublicRoute.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import Login from './pages/Login.tsx';
import UserManagement from './pages/UserManagement.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
