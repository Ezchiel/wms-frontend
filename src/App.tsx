import type React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import PublicRoute from './components/common/PublicRoute.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import {
  Login,
  PartnerManagement,
  ProductGroupManagement,
  ProductManagement,
  StorageLocationManagement,
  UserManagement,
} from './pages';

const router = createBrowserRouter([
  {
    // --- PUBLIC ROUTES ---
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    // --- PROTECTED ROUTES ---
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/users" replace />,
          },
          {
            path: 'users',
            element: <UserManagement />,
          },
          {
            path: 'product-groups',
            element: <ProductGroupManagement />,
          },
          {
            path: 'products',
            element: <ProductManagement />,
          },
          {
            path: 'partners',
            element: <PartnerManagement />,
          },
          {
            path: 'storageLocations',
            element: <StorageLocationManagement />,
          },
        ],
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
