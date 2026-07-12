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
  DashboardPage,
  ReportsPage,
  PendingReceiptsPage,
} from '../pages/admin/index.ts';
import { LoginPage } from '../pages/auth';
import {
  CountingAndLabelingPage,
  InventoryCheckMobilePage,
  PickingPage,
  PutawayPage,
  Scan,
  TasksPage,
  ProfilePage,
  ReceiptScanPage,
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
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'reports',
            element: <ReportsPage />,
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
            path: 'inventory-receipts-pending',
            element: <PendingReceiptsPage />,
          },
          {
            path: 'inventory-issues',
            element: <InventoryIssuePage />,
          },
          {
            path: 'inventory-checks',
            element: <InventoryCheckPage />,
          },
          {
            path: '*',
            element: <Navigate to="/dashboard" replace />,
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
            path: 'receipt-scan',
            element: <ReceiptScanPage />,
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
          {
            path: 'picking',
            element: <PickingPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: '*',
            element: <Navigate to="/mobile/tasks" replace />,
          },
        ],
      },
    ],
  },
]);
