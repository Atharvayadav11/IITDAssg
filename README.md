

# Assessment Portal

A hierarchical assessment management system built with React, TypeScript, Redux, and Shadcn UI. This application allows educators to create and manage structured assessments with domains, categories, and multiple-choice questions.

## Features

- **Hierarchical Data Structure**:
  - Domains (top level, e.g., Technology, Science)
  - Categories (second level, tied to domains, e.g., Frontend, Backend)
  - Questions (third level, tied to categories with multiple-choice options)

- **Complete CRUD Operations**:
  - Create, read, update, and delete for all entity types
  - Validation to ensure data integrity
  - Hierarchical relationship enforcement

- **Modern UI Components**:
  - Built with Shadcn UI for a clean, accessible interface
  - Responsive design for all screen sizes
  - Toast notifications for user feedback

- **State Management**:
  - Centralized Redux store with Redux Toolkit
  - Typed state with TypeScript
  - Async operations using Redux Thunks

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Vite (build tool)
  - React Router v6 (routing)
  - Shadcn UI (component library)
  - Tailwind CSS (styling)

- **State Management**:
  - Redux Toolkit
  - React-Redux

- **Data Persistence**:
  - LocalStorage (can be extended to use a backend API)

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Atharvayadav11/IITDAssg.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Managing Domains

1. Navigate to the dashboard
2. Click "Add Domain" to create a new domain
3. Enter the domain name and submit
4. Existing domains can be edited or deleted from the dashboard

### Managing Categories

1. Select a domain or navigate to the "Add Category" page
2. Select the parent domain
3. Enter the category name and submit
4. Categories can be edited or deleted from the domain view

### Managing Questions

1. Select a category or navigate to the "Add Question" page
2. Select the parent domain and category
3. Enter the question text
4. Add at least two options
5. Mark one option as the correct answer
6. Submit the question
7. Questions can be edited or deleted from the category view

## Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── common/          # Reusable components
│   ├── domains/         # Domain-related components
│   ├── categories/      # Category-related components
│   ├── questions/       # Question-related components
│   └── layout/          # Layout components
├── redux/
│   ├── store.ts         # Redux store configuration
│   └── slices/          # Redux slices for each entity
│       ├── domainSlice.ts
│       ├── categorySlice.ts
│       └── questionSlice.ts
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── AddDomain.tsx
│   ├── AddCategory.tsx
│   └── AddQuestion.tsx
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
├── hooks/               # Custom hooks
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```


## Acknowledgments

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
```
