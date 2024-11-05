import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

const CombinationSumInteractiveExercise = () => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize code and the first step
  useEffect(() => {
    setCode(stepSnippets[0]);
  }, []);

  // Code snippets for each step
  const stepSnippets = [
    `# Step 1: Initialize the result list inside the main function\n
def combination_sum(candidates, target):\n    results = []\n    return results`,
    `# Step 2: Define the helper function (backtracking function)\n
def combination_sum(candidates, target):\n    results = []\n\n    def helper(current, start, total):\n        pass\n\n    return results`,
    `# Step 3: Implement helper logic: track total sum\n
def combination_sum(candidates, target):\n    results = []\n\n    def helper(current, start, total):\n        if total == target:\n            results.append(current[:])\n        elif total > target:\n            return\n        else:\n            for i in range(start, len(candidates)):\n                current.append(candidates[i])\n                helper(current, i, total + candidates[i])\n                current.pop()\n\n    return results`,
    `# Step 4: Complete implementation and run helper from main\n
def combination_sum(candidates, target):\n    results = []\n\n    def helper(current, start, total):\n        if total == target:\n            results.append(current[:])\n        elif total > target:\n            return\n        else:\n            for i in range(start, len(candidates)):\n                current.append(candidates[i])\n                helper(current, i, total + candidates[i])\n                current.pop()\n    helper([], 0, 0)\n\n    return results`,
  ];

  // Expected output for each step
  const expectedOutputs = [
    "[]", // Step 1: Empty result array
    "[]", // Step 2: Empty result, helper not yet implemented
    "[]", // Step 3: Helper logic, but no valid combinations yet
    "[[2, 2, 3], [7]]", // Step 4: Full solution implemented
  ];

  // Instructions for each step
  const instructions = [
    "Step 1: Initialize the `results` array to store the valid combinations and return it.",
    "Step 2: Define the helper function `helper(current, start, total)` to track current combination, start index, and total sum.",
    "Step 3: Implement logic inside `helper` to check if total equals target and if so, append current combination to results.",
    "Step 4: Complete the function by adding the call to `helper([], 0, 0)` from the main function and return results.",
  ];

  // Function to check code output by sending it to the backend
  const handleCheckSubmission = async () => {
    try {
      const response = await axios.post('http://localhost:8080/execute', {
        language: 'python',
        code: code,
      });

      const actualOutput = response.data.output.trim();
      const expectedOutput = expectedOutputs[step].trim();

      if (actualOutput === expectedOutput) {
        setFeedback('Correct! Proceed to the next step.');
      } else {
        setFeedback(`Incorrect. Expected output: ${expectedOutput}, but got: ${actualOutput}`);
      }
    } catch (error) {
      console.error('Error running code:', error);
      setFeedback('Error executing code. Please try again.');
    }
  };

  // Move to the next step if output is correct
  const handleNextStep = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
      setCode(stepSnippets[step + 1]);
      setFeedback('');
    }
  };

  // Move to the previous step
  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setCode(stepSnippets[step - 1]);
      setFeedback('');
    }
  };

  // Handle code changes in the Monaco editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div>
      <h1>Interactive Backtracking Exercise: Combination Sum</h1>

      {/* Problem Description */}
      <div>
        <h2>Problem: Combination Sum</h2>
        <p>Given an array of distinct integers `candidates` and a target number `target`, return all unique combinations of `candidates` where the numbers sum to `target`.</p>
        <h3>Example:</h3>
        <p><strong>Input:</strong> candidates = [2,3,6,7], target = 7</p>
        <p><strong>Output:</strong> [[2,2,3],[7]]</p>
      </div>

      {/* Instruction */}
      <p>{instructions[step]}</p>

      {/* Code Editor */}
      <MonacoEditor
        width="800"
        height="400"
        language="python"
        theme="vs-dark"
        value={code}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={handleCodeChange}
      />

      {/* Feedback */}
      {feedback && <p style={{ color: feedback.includes('Correct') ? 'green' : 'red' }}>{feedback}</p>}

      {/* Controls */}
      <button onClick={handlePreviousStep} disabled={step === 0}>
        Previous
      </button>
      <button onClick={handleCheckSubmission}>
        Submit Code
      </button>
      {feedback.includes('Correct') && (
        <button onClick={handleNextStep} disabled={step === instructions.length - 1}>
          Next
        </button>
      )}

      {/* Output Section */}
      <h2>Output:</h2>
      <pre>{output}</pre>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default CombinationSumInteractiveExercise;
