// src/redux/slices/questionSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionOption } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Define initial state
interface QuestionState {
  questions: Question[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  status: 'idle',
  error: null,
};

// Async thunks for API interactions
export const fetchQuestions = createAsyncThunk('questions/fetchQuestions', async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll retrieve from localStorage if available
    const stored = localStorage.getItem('questions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
});

interface AddQuestionPayload {
  categoryId: string;
  title: string;
  options: string[];
  correctOptionIndex: number;
}

export const addQuestion = createAsyncThunk(
  'questions/addQuestion', 
  async ({ categoryId, title, options, correctOptionIndex }: AddQuestionPayload) => {
    // Create option objects with IDs
    const questionOptions: QuestionOption[] = options.map(text => ({
      id: uuidv4(),
      text
    }));
    
    const newQuestion: Question = {
      id: uuidv4(),
      categoryId,
      title,
      options: questionOptions,
      correctAnswerId: questionOptions[correctOptionIndex].id,
    };
    
    // In a real app, this would be an API call
    return newQuestion;
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async (question: Question) => {
    // In a real app, this would be an API call
    return question;
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async (id: string) => {
    // In a real app, this would be an API call
    return id;
  }
);

// Create the slice
const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch questions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch questions';
      })
      
      // Add question
      .addCase(addQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state.questions.push(action.payload);
        // Update localStorage
        localStorage.setItem('questions', JSON.stringify(state.questions));
      })
      
      // Update question
      .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const index = state.questions.findIndex(question => question.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
          // Update localStorage
          localStorage.setItem('questions', JSON.stringify(state.questions));
        }
      })
      
      // Delete question
      .addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.questions = state.questions.filter(question => question.id !== action.payload);
        // Update localStorage
        localStorage.setItem('questions', JSON.stringify(state.questions));
      });
  },
});

export default questionSlice.reducer;