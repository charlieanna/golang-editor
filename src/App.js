// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TextFetcher from './components/TextFetcher/TextFetcher';
import QuestionsList from './components/QuestionsList.jsx';
import QuestionDetail from './components/QuestionDetail.jsx';
import Header from './components/Header.jsx'; // Optional: For navigation

const App = () => {
  return (
    <Router>
      {/* Optional: Add a header or navigation bar */}
      <Header />
      <div>
        <Routes>
          {/* Route for the TextFetcher component */}
          <Route path="/" element={<TextFetcher />} />
          
          {/* Route for the QuestionsList component */}
          <Route path="/questions" element={<QuestionsList />} />
          
          {/* Question Detail route with site and question_id as URL parameters */}
          <Route path="/questions/:site/:question_id" element={<TextFetcher />} />

          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
