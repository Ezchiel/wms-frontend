import type React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import PublicRoute from './components/common/PublicRoute.tsx';
import AdminLayout from './layouts/AdminLayout';
import MobileLayout from './layouts/MobileLayout';
import {
  InventoryReceipt,
  InventoryStock,
  PartnerManagement,
  ProductGroupManagement,
  ProductManagement,
  StorageLocationManagement,
  UserManagement,
} from './pages/admin';
import { Login } from './pages/auth';
import { CountingAndLabeling, PutawayGuidance, Scan, Tasks } from './pages/mobile';

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
      // FOR ADMIN (Desktop)
      {
        path: '/',
        element: <AdminLayout />,
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
            path: 'storage-locations',
            element: <StorageLocationManagement />,
          },
          {
            path: 'inventory-stocks',
            element: <InventoryStock />,
          },
          {
            path: 'inventory-receipts',
            element: <InventoryReceipt />,
          },
        ],
      },

      // FOR MOBILE (HANDHELD)
      {
        path: '/mobile',
        element: <MobileLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/mobile/tasks" replace />,
          },
          {
            path: 'tasks',
            element: <Tasks />,
          },
          {
            path: 'count-and-label',
            element: <CountingAndLabeling />,
          },
          {
            path: 'scan',
            element: <Scan />,
          },
          {
            path: 'put-away',
            element: <PutawayGuidance />,
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
