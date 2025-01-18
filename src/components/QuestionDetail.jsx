// src/components/QuestionDetail.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import useFetchExercises from '../hooks/useFetchExercises';
import './QuestionDetail.css'; // Optional: For styling

const QuestionDetail = () => {
  const { site, question_id } = useParams(); // Extract 'site' and 'question_id' from the URL

  // Use the custom hook with 'site' and 'question_id'
  const { exercises, isLoading, error } = useFetchExercises(site, question_id);

  return (
    <div className="question-detail">
      {/* Your existing question detail rendering logic */}

      <h2>Exercises</h2>
      {isLoading && <p>Loading exercises...</p>}
      {error && <p>{error}</p>}
      {exercises}
      {!isLoading && !error && exercises.length > 0 && (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              {/* Render exercise details */}
              <p>{exercise.description}</p>
              {/* Add more fields as necessary */}
            </li>
          ))}
        </ul>
      )}
      {!isLoading && !error && exercises.length === 0 && <p>No exercises available.</p>}
    </div>
  );
};

export default QuestionDetail;
