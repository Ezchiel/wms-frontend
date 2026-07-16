import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.ts';
import inventoryReceiptReducer from '../features/inventoryReceipt/inventoryReceiptSlice.ts';
import inventoryStockReducer from '../features/inventoryStock/inventoryStockSlice.ts';
import partnerReducer from '../features/partners/partnerSlice.ts';
import productGroupReducer from '../features/productGroups/productGroupSlice.ts';
import productReducer from '../features/products/productSlice.ts';
import putawayReducer from '../features/putaway/putawaySlice.ts';
import storageLocationReducer from '../features/storageLocation/storageLocationSlice.ts';
import userReducer from '../features/users/userSlices.ts';
import inventoryCheckReducer from '../features/inventoryCheck/inventoryCheckSlice.ts';
import inventoryIssueReducer from '../features/inventoryIssue/inventoryIssueSlice.ts';
import pickingReducer from '../features/picking/pickingSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice.ts';
import reportsReducer from '../features/reports/reportsSlice.ts';
import notificationReducer from '../features/notifications/notificationSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    productGroups: productGroupReducer,
    products: productReducer,
    partners: partnerReducer,
    storageLocations: storageLocationReducer,
    inventoryReceipts: inventoryReceiptReducer,
    inventoryStocks: inventoryStockReducer,
    putaway: putawayReducer,
    inventoryCheck: inventoryCheckReducer,
    inventoryIssues: inventoryIssueReducer,
    picking: pickingReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
