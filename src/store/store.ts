import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import partnerReducer from './slices/partnerSlice.ts';
import productGroupReducer from './slices/productGroupSlice.ts';
import productReducer from './slices/productSlice.ts';
import storageLocationReducer from './slices/storageLocationSlice.ts';
import userReducer from './slices/userSlices.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    productGroups: productGroupReducer,
    products: productReducer,
    partners: partnerReducer,
    storageLocations: storageLocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
