import React, { useState, useEffect } from 'react';
import CodeEditorComponent from './CodeEditorComponent';
import { executeCode } from '../../services/api';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import golang from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import github from 'react-syntax-highlighter/dist/esm/styles/hljs/github';
import { useParams } from 'react-router-dom';
import useFetchExercises from '../../hooks/useFetchExercises';

// Register the Go language for syntax highlighting
SyntaxHighlighter.registerLanguage('go', golang);

/**
 * ExerciseItem Component
 * Renders individual exercise details and handles user interactions.
 */
const ExerciseItem = () => {
  const { site, question_id } = useParams(); // Extract 'site' and 'question_id' from the URL

  // Use the custom hook to fetch exercises from your backend
  const { exercises, isLoading, error } = useFetchExercises(site, question_id);

  // State variables
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error1, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // For hints and solution
  const [hintIndex, setHintIndex] = useState(0); 
  const [displayedHints, setDisplayedHints] = useState([]);
  const [showSolution, setShowSolution] = useState(false);

  // Submission feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Once data is loaded, set the initial code template
    if (!isLoading && exercises && !error) {
      console.log('useexercises:', exercises);
      // If the backend returns "code_template", use that. Otherwise, fallback to an empty string.
      setCode(exercises.code_template || '');
    }
  }, [isLoading, error, exercises]);

  /**
   * Handles changes in the code editor.
   * @param {string} newCode - The updated code from the editor.
   */
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  /**
   * Handles the execution of user-submitted code.
   */
  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    try {
      const response = await executeCode('golang', code, site, question_id);
      setOutput(response.output || 'No output');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error running the code');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Handles the submission of the exercise.
   * Checks if the output matches the expected output.
   */
  const handleSubmit = () => {
    // Evaluate correctness if an expectedOutput is provided
    if (exercises.expected_output) {
      const expected = exercises.expected_output.trim();
      const actual = output.trim();
      const correct = (actual === expected);
      setIsCorrect(correct);
      setIsSubmitted(true);
    } else {
      // If no expected output is provided, treat it as correct
      setIsCorrect(true);
      setIsSubmitted(true);
    }
  };

  /**
   * Shows the next hint or the full solution if all hints have been shown.
   */
  const handleShowHint = () => {
    // If there are no hints at all, do nothing
    if (!exercises.hints) return;

    if (hintIndex < exercises.hints.length) {
      // Show the next hint
      setDisplayedHints([...displayedHints, exercises.hints[hintIndex]]);
      setHintIndex(hintIndex + 1);
    } else {
      // No more hints; display the full solution
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
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <h2>
        {exercises?.difficulty} Level: {exercises?.title}
      </h2>
      <p>
        <strong>Problem:</strong> {exercises?.problem_statement}
      </p>
      <p>
        <strong>Instructions:</strong> {exercises?.instructions}
      </p>

      {/* Code Editor */}
      <CodeEditorComponent code={code} onChange={handleCodeChange} />

      <br />

      {/* Buttons for running code and submitting */}
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
            transition: 'background-color 0.3s',
          }}
          aria-label="Run code"
          onMouseOver={(e) => {
            if (!isRunning) e.currentTarget.style.backgroundColor = '#138496';
          }}
          onMouseOut={(e) => {
            if (!isRunning) e.currentTarget.style.backgroundColor = '#17a2b8';
          }}
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
            transition: 'background-color 0.3s',
          }}
          aria-label="Submit solution"
          onMouseOver={(e) => {
            if (!(!output || isSubmitted)) e.currentTarget.style.backgroundColor = '#218838';
          }}
          onMouseOut={(e) => {
            if (!(!output || isSubmitted)) e.currentTarget.style.backgroundColor = '#28a745';
          }}
        >
          Submit
        </button>

        {/* Show Hints / Show Solution Button */}
        {exercises?.hints && exercises.hints.length > 0 && (
          <button
            onClick={handleShowHint}
            disabled={hintIndex >= exercises.hints.length && showSolution}
            style={{
              padding: '8px 16px',
              cursor: hintIndex >= exercises.hints.length && showSolution ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              flex: '1 1 auto',
              transition: 'background-color 0.3s',
            }}
            aria-label={
              hintIndex < exercises.hints.length
                ? 'Show next hint'
                : showSolution
                ? 'Solution shown'
                : 'Show solution'
            }
            onMouseOver={(e) => {
              if (!(hintIndex >= exercises.hints.length && showSolution)) {
                e.currentTarget.style.backgroundColor = '#e0a800';
              }
            }}
            onMouseOut={(e) => {
              if (!(hintIndex >= exercises.hints.length && showSolution)) {
                e.currentTarget.style.backgroundColor = '#ffc107';
              }
            }}
          >
            {hintIndex < exercises.hints.length
              ? 'Show Hint'
              : showSolution
              ? 'Solution Shown'
              : 'Show Solution'}
          </button>
        )}
      </div>

      {/* Hints Section */}
      {displayedHints.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#fff3cd',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ffeeba',
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

      {/* Full Solution Section */}
      {showSolution && exercises?.solution_explanation && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#d1ecf1',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #bee5eb',
          }}
        >
          <strong>Solution Explanation:</strong>
          <p>{exercises.solution_explanation}</p>

          {exercises.solution_code && (
            <>
              <strong>Solution Code:</strong>
              <SyntaxHighlighter language="go" style={github}>
                {exercises.solution_code}
              </SyntaxHighlighter>
            </>
          )}
        </div>
      )}

      {/* Code Output */}
      {output && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#e2e3e5',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #d6d8db',
          }}
        >
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}

      {/* Error Handling */}
      {error1 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
          }}
        >
          <strong>Error:</strong> {error1}
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
            border: isCorrect ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          }}
        >
          <h3 style={{ color: isCorrect ? '#155724' : '#721c24' }}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect.'}
          </h3>
          {!isCorrect && exercises.expected_output && (
            <p>
              <strong>Expected Output:</strong> {exercises.expected_output}
            </p>
          )}
          {exercises.solution_explanation && (
            <p>
              <strong>Explanation:</strong> {exercises.solution_explanation}
            </p>
          )}
        </div>
      )}

      {/* References */}
      {exercises?.references && exercises.references.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#e2e3e5',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #d6d8db',
          }}
        >
          <strong>References:</strong>
          <ul>
            {exercises.references.map((reference, index) => (
              <li key={index}>
                <a href={reference} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                  {reference}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
