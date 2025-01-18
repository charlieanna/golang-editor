// src/components/TextFetcher/TextFetcher.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Base URL of your backend API
const API_BASE_URL = 'http://localhost:8081'; // Update if your backend runs on a different port or domain


/**
 * TextFetcher Component
 * Fetches and displays a list of coding exercises based on the site and question ID extracted from the URL.
 */
const TextFetcher = () => {
  const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Replace with your actual API endpoint
      const fetchQuestions = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/questions`); // Adjust the path as needed
              console.log(response.data.questions);
              setQuestions(response.data.questions);
              setLoading(false);
          } catch (err) {
              setError('Failed to fetch questions.');
              setLoading(false);
          }
      };

      fetchQuestions();
  }, []);



  return (
         <div className="questions-list">
             <h2>All Fetched Questions</h2>
             {questions.length === 0 ? (
                 <p>No questions available.</p>
             ) : (
                 <ul>
                     {questions.map((question) => (
                         <li key={question.question_id}>
                             <h3>
                                 <Link to={`/exercises/${question.site}/${question.question}`}>{question.question}</Link>
                             </h3>
                             <p>{question.content}</p>
                             {/* Add more fields as necessary */}
                         </li>
                     ))}
                 </ul>
             )}
         </div>
     );
};

export default TextFetcher;
