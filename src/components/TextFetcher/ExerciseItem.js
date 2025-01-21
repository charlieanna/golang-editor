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

const ExerciseItem = () => {
  const { site, question_id } = useParams();
  const { exercises, isLoading, error } = useFetchExercises(site, question_id);

  // Editor / Output / Error
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error1, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // A new piece of state to track overall test status
  // Could be "unknown", "allPassed", or "someFailed"
  const [testStatus, setTestStatus] = useState('unknown');


  // Hints + solution toggles
  const [hintIndex, setHintIndex] = useState(0);
  const [displayedHints, setDisplayedHints] = useState([]);
  const [showSolution, setShowSolution] = useState(false);

  // Submission feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // New toggles for showing test cases & solution
  const [showTestCases, setShowTestCases] = useState(false);

  useEffect(() => {
    if (!isLoading && exercises && !error) {
      setCode(exercises.code_template || '');
    }
  }, [isLoading, error, exercises]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    try {
      const response = await executeCode('golang', code, site, question_id);
      const logOutput = response.output || 'No output';
      // Display full container logs
      setOutput(logOutput);

      // Here we parse the logs. Suppose each test line includes the word "passed" or "failed"
      const lines = logOutput.split('\n');
      let anyFailed = false;
 
      for (const line of lines) {
        if (line.toLowerCase().includes('Fail')) {
          anyFailed = true;
          break;
        }
      }
      if (anyFailed) {
        setTestStatus('someFailed');
      } else {
        setTestStatus('allPassed');
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error running the code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (exercises.expected_output) {
      const expected = exercises.expected_output.trim();
      const actual = output.trim();
      const correct = (actual === expected);
      setIsCorrect(correct);
      setIsSubmitted(true);
    } else {
      // If there's no expected output, treat it as correct
      setIsCorrect(true);
      setIsSubmitted(true);
    }
  };

  const handleShowHint = () => {
    if (!exercises.hints) return;

    if (hintIndex < exercises.hints.length) {
      setDisplayedHints([...displayedHints, exercises.hints[hintIndex]]);
      setHintIndex(hintIndex + 1);
    } else {
      // If we've shown all hints, you could also show the solution automatically here
      // setShowSolution(true);
    }
  };

  const handleToggleTestCases = () => {
    setShowTestCases(!showTestCases);
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
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
      <h2>{exercises?.difficulty} Level: {exercises?.title}</h2>
      <p><strong>Problem:</strong> {exercises?.problem_statement}</p>
      <p><strong>Instructions:</strong> {exercises?.instructions}</p>

      {/* Code Editor */}
      <CodeEditorComponent code={code} onChange={handleCodeChange} />

      <br />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* Run Code */}
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

        {/* Submit Code */}
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

        {/* Show Hints */}
        {exercises?.hints && exercises.hints.length > 0 && (
          <button
            onClick={handleShowHint}
            disabled={hintIndex >= exercises.hints.length}
            style={{
              padding: '8px 16px',
              cursor: hintIndex >= exercises.hints.length ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              flex: '1 1 auto',
              transition: 'background-color 0.3s',
            }}
            aria-label="Show next hint"
            onMouseOver={(e) => {
              if (!(hintIndex >= exercises.hints.length)) e.currentTarget.style.backgroundColor = '#e0a800';
            }}
            onMouseOut={(e) => {
              if (!(hintIndex >= exercises.hints.length)) e.currentTarget.style.backgroundColor = '#ffc107';
            }}
          >
            {hintIndex < exercises.hints.length ? 'Show Hint' : 'All hints shown'}
          </button>
        )}

        {/* Show/Hide Test Cases */}
        {exercises?.test_cases && exercises.test_cases.length > 0 && (
          <button
            onClick={handleToggleTestCases}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              flex: '1 1 auto',
              transition: 'background-color 0.3s',
            }}
            aria-label="Show or hide test cases"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff';
            }}
          >
            {showTestCases ? 'Hide Test Cases' : 'Show Test Cases'}
          </button>
        )}

        {/* Show/Hide Solution */}
        {exercises?.solution_explanation && exercises?.solution_code && (
          <button
            onClick={handleToggleSolution}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              flex: '1 1 auto',
              transition: 'background-color 0.3s',
            }}
            aria-label="Show or hide solution"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
            }}
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
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

      {/* Test Cases Section */}
      {showTestCases && exercises?.test_cases && exercises.test_cases.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#f2f2f2',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <strong>Test Cases:</strong>
          <ul>
            {exercises.test_cases.map((tc, index) => (
              <li key={index}>
                <strong>Input:</strong> {JSON.stringify(tc.input)} |{" "}
                <strong>Expected Output:</strong> {JSON.stringify(tc.expected_output)}
              </li>
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

      {/* Show overall test status */}
      {testStatus === 'allPassed' && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          All tests passed! ✅
        </div>
      )}
      {testStatus === 'someFailed' && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          At least one test failed. ❌
        </div>
      )}
      {/* (testStatus = 'unknown' means we haven't run or are in progress) */}

      {/* Error Handling */}
      {error1 && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>Error:</strong> {error1}
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
