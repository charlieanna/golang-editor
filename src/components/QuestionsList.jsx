// src/components/QuestionsList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuestionsList.css'; // Optional: For styling

// Base URL of your backend API
const API_BASE_URL = 'http://localhost:8080'; // Update if your backend runs on a different port or domain

const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace with your actual API endpoint
        const fetchQuestions = async () => {
            try {
              const response = await axios.get(`${API_BASE_URL}/questions`); // Adjust the path as needed
                console.log(response.data);
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch questions.');
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <div>Loading questions...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                                <Link to={`/questions/${question.site}/${question.question_id}`}>{question.question_text.title}</Link>
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

export default QuestionsList;
