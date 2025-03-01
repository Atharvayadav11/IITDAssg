// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import domainReducer from '../redux/slices/domainSlice';
import categoryReducer from '../redux/slices/categorySlice';
import questionReducer from '../redux/slices/questionSlice';

export const store = configureStore({
  reducer: {
    domains: domainReducer,
    categories: categoryReducer,
    questions: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;