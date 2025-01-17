// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TextFetcher from './components/TextFetcher/TextFetcher';
import QuestionsList from './components/QuestionsList.jsx';
import Header from './components/Header.jsx'; // Optional: For navigation
import QuestionDetail from './components/QuestionDetail.jsx';

const App = () => {
  return (
    <Router>
      {/* Optional: Add a header or navigation bar */}
      <Header />
      <div>
        <Routes>
          
          {/* Route for the QuestionsList component */}
          <Route path="/questions" element={<QuestionsList />} />
          
          {/* Question Detail route with site and question_id as URL parameters */}
          <Route path="/questions/:site/:question_id" element={<TextFetcher />} />

          {/* Question Detail route with site and question_id as URL parameters */}
          <Route path="/exercises/:site/:question_id" element={<QuestionDetail />} />

          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
