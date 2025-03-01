// src/redux/slices/domainSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Domain } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Define initial state
interface DomainState {
  domains: Domain[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DomainState = {
  domains: [],
  status: 'idle',
  error: null,
};

// Async thunks for API interactions
export const fetchDomains = createAsyncThunk('domains/fetchDomains', async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll retrieve from localStorage if available
    const stored = localStorage.getItem('domains');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
});

export const addDomain = createAsyncThunk(
  'domains/addDomain', 
  async (name: string) => {
    const newDomain: Domain = {
      id: uuidv4(),
      name,
    };
    
    // In a real app, this would be an API call
    return newDomain;
  }
);

export const updateDomain = createAsyncThunk(
  'domains/updateDomain',
  async (domain: Domain) => {
    // In a real app, this would be an API call
    return domain;
  }
);

export const deleteDomain = createAsyncThunk(
  'domains/deleteDomain',
  async (id: string) => {
    // In a real app, this would be an API call
    return id;
  }
);

// Create the slice
const domainSlice = createSlice({
  name: 'domains',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch domains
      .addCase(fetchDomains.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDomains.fulfilled, (state, action: PayloadAction<Domain[]>) => {
        state.status = 'succeeded';
        state.domains = action.payload;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch domains';
      })
      
      // Add domain
      .addCase(addDomain.fulfilled, (state, action: PayloadAction<Domain>) => {
        state.domains.push(action.payload);
        // Update localStorage
        localStorage.setItem('domains', JSON.stringify(state.domains));
      })
      
      // Update domain
      .addCase(updateDomain.fulfilled, (state, action: PayloadAction<Domain>) => {
        const index = state.domains.findIndex(domain => domain.id === action.payload.id);
        if (index !== -1) {
          state.domains[index] = action.payload;
          // Update localStorage
          localStorage.setItem('domains', JSON.stringify(state.domains));
        }
      })
      
      // Delete domain
      .addCase(deleteDomain.fulfilled, (state, action: PayloadAction<string>) => {
        state.domains = state.domains.filter(domain => domain.id !== action.payload);
        // Update localStorage
        localStorage.setItem('domains', JSON.stringify(state.domains));
      });
  },
});

export default domainSlice.reducer;