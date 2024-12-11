// src/components/TextFetcher/ExerciseItem.js

import React, { useState, useEffect } from 'react';
import CodeEditorComponent from './CodeEditorComponent';
import { executeCode } from '../../services/api';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import golang from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import github from 'react-syntax-highlighter/dist/esm/styles/hljs/github';

// Register the Go language for syntax highlighting
SyntaxHighlighter.registerLanguage('go', golang);

/**
 * ExerciseItem Component
 * Renders individual exercise details and handles user interactions.
 * @param {Object} props - Component props.
 */
const ExerciseItem = ({ exercise, onCompletion }) => {
  // State variables
  const [code, setCode] = useState(exercise.code_template.trim());
  const [output, setOutput] = useState('');
  const [hintIndex, setHintIndex] = useState(0); // Tracks the current hint to display
  const [displayedHints, setDisplayedHints] = useState([]); // Stores hints shown to the user
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false); // Controls the display of the full solution

  // Reset state when a new exercise is received
  useEffect(() => {
    setCode(exercise.code_template.trim());
    setOutput('');
    setHintIndex(0);
    setDisplayedHints([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsRunning(false);
    setError(null);
    setShowSolution(false);
  }, [exercise]);

  /**
   * Handles changes in the code editor.
   * @param {string} newCode - The updated code from the editor.
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
    console.log(!output);
    console.log(isSubmitted);
    // Evaluate correctness
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
   * Handles displaying the next hint or the full solution.
   */
  const handleShowHint = () => {
    if (hintIndex < exercise.hints.length) {
      // Show the next hint
      setDisplayedHints([...displayedHints, exercise.hints[hintIndex]]);
      setHintIndex(hintIndex + 1);
    } else if (hintIndex === exercise.hints.length) {
      // All hints have been shown; now display the full solution
      setShowSolution(true);
    }
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

      {/* Code Editor */}
      <CodeEditorComponent code={code} onChange={handleCodeChange} />

      <br />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            backgroundColor: '#17a2b8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            flex: '1 1 auto',
          }}
          aria-label="Run code"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!output || isSubmitted}
          style={{
            padding: '8px 16px',
            cursor: !output || isSubmitted ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            flex: '1 1 auto',
          }}
          aria-label="Submit solution"
        >
          Submit
        </button>
        <button
          onClick={handleShowHint}
          disabled={hintIndex > exercise.hints.length}
          style={{
            padding: '8px 16px',
            cursor: hintIndex > exercise.hints.length ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            backgroundColor: '#ffc107',
            color: '#212529',
            border: 'none',
            borderRadius: '4px',
            flex: '1 1 auto',
          }}
          aria-label={hintIndex < exercise.hints.length ? 'Show next hint' : 'Show solution'}
        >
          {hintIndex < exercise.hints.length ? 'Show Hint' : 'Show Solution'}
        </button>
      </div>

      {/* Hints */}
      {displayedHints.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#fff3cd',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>Hints:</strong>
          <ul>
            {displayedHints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Solution */}
      {showSolution && exercise.solution_explanation && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#d1ecf1',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>Solution Explanation:</strong>
          <p>{exercise.solution_explanation}</p>
          
          <strong>Solution Code:</strong>
          <SyntaxHighlighter language="go" style={github}>
            {exercise.solution_code}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Output */}
      {output && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#e2e3e5',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>Error:</strong> {error}
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
            {isCorrect ? '✅ Correct!' : '❌ Incorrect.'}
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
