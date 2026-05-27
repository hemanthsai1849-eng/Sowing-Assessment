import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
