import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';


// Pages
import Dashboard from './pages/Dashboard';
import AddDomain from './pages/AddDomain';
import AddCategory from './pages/AddCategory';
import AddQuestion from './pages/AddQuestion';


// Layout
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-domain" element={<AddDomain />} />
           
            <Route path="/add-category" element={<AddCategory />} />
          
            <Route path="/add-question" element={<AddQuestion />} />
          
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
     
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;