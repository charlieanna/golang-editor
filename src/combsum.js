import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

const CombinationSumInteractiveExercise = () => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize the first step when component loads
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

  // Instructions for each step
  const instructions = [
    "Step 1: Initialize the `results` array to store the valid combinations and return it.",
    "Step 2: Define the helper function `helper(current, start, total)` to track current combination, start index, and total sum.",
    "Step 3: Implement logic inside `helper` to check if total equals target and if so, append current combination to results.",
    "Step 4: Complete the function by adding the call to `helper([], 0, 0)` from the main function and return results."
  ];

  // Expected results for validation at each step
  const expectedSubmissions = [
    `def combination_sum(candidates, target):\n    results = []\n    return results`,
    `def combination_sum(candidates, target):\n    results = []\n\n    def helper(current, start, total):\n        pass\n    return results`,
    `def combination_sum(candidates, target):\n    results = []\n\n    def helper(current, start, total):\n        if total == target:\n            results.append(current[:])\n        elif total > target:\n            return\n        else:\n            for i in range(start, len(candidates)):\n                current.append(candidates[i])\n                helper(current, i, total + candidates[i])\n                current.pop()\n    return results`,
  ];

  // Move to the next step if user input is correct
  const handleNextStep = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
      setCode(stepSnippets[step + 1]);
      setFeedback('');
    }
  };

  // Check user's submission
  const handleCheckSubmission = () => {
    console.log(code.trim(), "\n", expectedSubmissions[step].trim())
    if (code.trim() === expectedSubmissions[step].trim()) {
      setFeedback('Correct! Proceed to the next step.');
    } else {
      setFeedback('Incorrect. Please try again.');
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

  // Handle running the code
  const handleRunCode = async () => {
    try {
      const response = await fetch('http://localhost:8080/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'python', code }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setErrorMessage('Error executing code');
    }
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
      <button onClick={handleRunCode}>Run Code</button>

      {/* Output Section */}
      <h2>Output:</h2>
      <pre>{output}</pre>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default CombinationSumInteractiveExercise;
