// src/components/TextFetcher/ExerciseItem.js
import React, { useState, useEffect } from 'react';
import CodeEditorComponent from './CodeEditorComponent';
import { executeCode } from '../../services/api';

/**
 * ExerciseItem Component
 * Renders individual exercise details and handles user interactions.
 * @param {Object} props - Component props.
 */
const ExerciseItem = ({ exercise, onCompletion }) => {
  const [code, setCode] = useState(exercise.initialCode.trim());
  const [output, setOutput] = useState('');
  const [hint, setHint] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  // Add useEffect to reset state when 'exercise' prop changes
  useEffect(() => {
    setCode(exercise.code_template.trim());
    setOutput('');
    setHint('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsRunning(false);
    setError(null);
  }, [exercise]);

  /**
   * Handles changes in the code editor.
   * @param {string} newinitialCodeCode - The updated code from the editor.
   */
  const handleCodeChange = (newCode) => {
    console.log('Code updated:', newCode);
    setCode(newCode);
  };

  /**
   * Handles the execution of user-submitted code.
   */
  const handleRunCode = async () => {
    console.log('Running code:', code);
    setIsRunning(true);
    setError(null);
    setOutput('');
    try {
      const response = await executeCode('golang', code);
      setOutput(response.output || 'No output');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error running the code');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Handles the submission of the exercise.
   * Evaluates whether the output matches expected criteria.
   */
  const handleSubmit = () => {
    console.log('Submitted:');
    console.log(!output)
    console.log(isSubmitted)
    // For simplicity, we'll assume that the presence of expected output indicates correctness.
    // In a real-world scenario, you'd have more robust evaluation.
    if (exercise.expectedOutput) {
      const expected = exercise.expectedOutput.trim();
      const actual = output.trim();
      const correct = actual === expected;
      setIsCorrect(correct);
      setIsSubmitted(true);
      onCompletion(correct);
    } else {
      // If no expected output is provided, consider submission as correct
      setIsCorrect(true);
      setIsSubmitted(true);
      onCompletion(true);
    }
  };

  /**
   * Handles displaying the hint for the current exercise.
   */
  const handleHint = () => {
    console.log('Hint requested:', exercise);
    setHint(exercise.hint);
  };

  return (
    <div
      style={{
        marginBottom: '40px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <h2>
        {exercise.difficulty} Level: {exercise.title}
      </h2>
      <p>
        <strong>Problem:</strong> {exercise.problem_statement}
      </p>
      <p>
        <strong>Instructions:</strong> {exercise.instructions}
      </p>
     
      {/* Monaco Editor */}
      <CodeEditorComponent code={code} onChange={handleCodeChange} />

      <br />

      {/* Buttons */}
      <button
        onClick={handleRunCode}
        disabled={isRunning}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          marginRight: '10px',
          fontSize: '16px',
          backgroundColor: '#17a2b8',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
      <button
        onClick={handleSubmit}
        // disabled={!output || isSubmitted}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          marginRight: '10px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Submit
      </button>
      <button
        onClick={handleHint}
        disabled={hint}
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '16px',
          backgroundColor: '#ffc107',
          color: '#212529',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Show Hint
      </button>

      {/* Hint */}
      {hint && (
        <div style={{ marginTop: '20px', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
          <strong>Hint:</strong> {hint}
        </div>
      )}

      {/* Output */}
      {output && (
        <div style={{ marginTop: '20px', backgroundColor: '#e2e3e5', padding: '10px', borderRadius: '4px' }}>
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}

      {/* Submission Feedback */}
      {isSubmitted && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ color: isCorrect ? '#155724' : '#721c24' }}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </h3>
          {!isCorrect && exercise.expectedOutput && (
            <p>
              <strong>Expected Output:</strong> {exercise.expectedOutput}
            </p>
          )}
          {exercise.solution_explanation && (
            <p>
              <strong>Explanation:</strong> {exercise.solution_explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
