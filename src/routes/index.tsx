import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import MobileLayout from '../layouts/MobileLayout';
import {
  InventoryCheckPage,
  InventoryReceiptPage,
  InventoryStockPage,
  PartnerPage,
  ProductGroupPage,
  ProductPage,
  StorageLocationPage,
  UserPage,
  InventoryIssuePage,
} from '../pages/admin/index.ts';
import { LoginPage } from '../pages/auth';
import {
  CountingAndLabelingPage,
  InventoryCheckMobilePage,
  PutawayPage,
  Scan,
  TasksPage,
} from '../pages/mobile';
import ProtectedRoute from './ProtectedRoute.tsx';
import PublicRoute from './PublicRoute.tsx';
import InventoryCheckScannerMobileFeature from '../features/inventoryCheckScannerMobile/InventoryCheckScannerMobileFeature.tsx';

export const router = createBrowserRouter([
  {
    // --- PUBLIC ROUTES ---
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
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
            element: <UserPage />,
          },
          {
            path: 'product-groups',
            element: <ProductGroupPage />,
          },
          {
            path: 'products',
            element: <ProductPage />,
          },
          {
            path: 'partners',
            element: <PartnerPage />,
          },
          {
            path: 'storage-locations',
            element: <StorageLocationPage />,
          },
          {
            path: 'inventory-stocks',
            element: <InventoryStockPage />,
          },
          {
            path: 'inventory-receipts',
            element: <InventoryReceiptPage />,
          },
          {
            path: 'inventory-issues',
            element: <InventoryIssuePage />,
          },
          {
            path: 'inventory-checks',
            element: <InventoryCheckPage />,
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
            element: <TasksPage />,
          },
          {
            path: 'count-and-label/:receiptId',
            element: <CountingAndLabelingPage />,
          },
          {
            path: 'scan',
            element: <Scan />,
          },
          {
            path: 'put-away',
            element: <PutawayPage />,
          },
          {
            path: 'inventory-check-mobile',
            element: <InventoryCheckMobilePage />,
          },
          {
            path: 'inventory-check-scanner-mobile',
            element: <InventoryCheckScannerMobileFeature />,
          },
        ],
      },
    ],
  },
]);
