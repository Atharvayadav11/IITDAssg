// src/types/index.ts

export interface Domain {
    id: string;
    name: string;
  }
  
  export interface Category {
    id: string;
    domainId: string;
    name: string;
  }
  
  export interface QuestionOption {
    id: string;
    text: string;
  }
  
  export interface Question {
    id: string;
    categoryId: string;
    title: string;
    options: QuestionOption[];
    correctAnswerId: string;
  }