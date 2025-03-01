// src/redux/slices/categorySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Define initial state
interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  status: 'idle',
  error: null,
};

// Async thunks for API interactions
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll retrieve from localStorage if available
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
});

export const addCategory = createAsyncThunk(
  'categories/addCategory', 
  async ({ name, domainId }: { name: string; domainId: string }) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      domainId,
    };
    
    // In a real app, this would be an API call
    return newCategory;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category) => {
    // In a real app, this would be an API call
    return category;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string) => {
    // In a real app, this would be an API call
    return id;
  }
);

// Create the slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      
      // Add category
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
        // Update localStorage
        localStorage.setItem('categories', JSON.stringify(state.categories));
      })
      
      // Update category
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
          // Update localStorage
          localStorage.setItem('categories', JSON.stringify(state.categories));
        }
      })
      
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.categories = state.categories.filter(category => category.id !== action.payload);
        // Update localStorage
        localStorage.setItem('categories', JSON.stringify(state.categories));
      });
  },
});

export default categorySlice.reducer;