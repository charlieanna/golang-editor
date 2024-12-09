// src/components/TextFetcher/ExerciseList.js

import React, { useState } from 'react';
import ExerciseItem from './ExerciseItem';

/**
 * ExerciseList Component
 * Renders a single ExerciseItem based on the currentExerciseIndex.
 * Manages the progression through the exercises.
 * @param {Array} exercises - Array of exercise objects to render.
 */
const ExerciseList = ({ exercises }) => {
  // Inside ExerciseList.js or wherever exercises are received
  console.log('Fetched Exercises:', exercises);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // Tracks the current exercise
  const [isCompleted, setIsCompleted] = useState(false); // Tracks if all exercises are completed

  /**
   * Handles the successful completion of an exercise.
   * @param {number} exerciseId - The ID of the completed exercise.
   */
  const handleExerciseCompletion = (exerciseId) => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  /**
   * Retrieves the current exercise based on currentExerciseIndex.
   */
  const currentExercise = exercises[currentExerciseIndex];

  return (
    <>
      {isCompleted ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>Congratulations!</h2>
          <p>You have successfully completed all exercises.</p>
        </div>
      ) : (
        <ExerciseItem
          exercise={currentExercise}
          onCompletion={handleExerciseCompletion}
        />
      )}
    </>
  );
};

export default ExerciseList;
