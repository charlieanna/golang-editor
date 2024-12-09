// src/components/TextFetcher/Exercise.js

import React, { useState } from 'react';
import ExerciseItem from './ExerciseItem';

/**
 * Exercise Component
 * Manages the progression through exercises, displaying one at a time.
 * @param {Array} exercises - Array of exercise objects to render.
 */
const Exercise = ({ exercises }) => {
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current exercise index
  const [isCompleted, setIsCompleted] = useState(false); // Indicates if all exercises are completed

  /**
   * Handles the successful completion of an exercise.
   * @param {boolean} isSuccess - Whether the exercise was successfully completed.
   */
  const handleCompletion = (isSuccess) => {
    if (isSuccess) {
      if (currentStep < exercises.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsCompleted(true);
      }
    }
  };

  return (
    <>
      {isCompleted ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>Congratulations!</h2>
          <p>You have successfully completed all exercises.</p>
        </div>
      ) : (
        <ExerciseItem
          exercise={exercises[currentStep]}
          onCompletion={handleCompletion}
        />
      )}
    </>
  );
};

export default Exercise;
