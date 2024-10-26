import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

const BacktrackingEditor = () => {
  const [code, setCode] = useState(`def backtracking():\n    # Step 1: Define the function\n`);
  const [output, setOutput] = useState('');
  const [step, setStep] = useState(1);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/execute', {
        language: 'python',
        code: code,
      });
      const data = await response.data;
      setOutput(response.data.output || 'No output');
    } catch (error) {
      setOutput(error.response ? error.response.data.error : 'Error running the code');
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Step 2: Prompt the user to add a base case
      setCode(`def backtracking():\n    # Step 1: Define the function\n    # Step 2: Add a base case\n    if base_case_condition:\n        return\n`);
      setStep(2);
    } else if (step === 2) {
      // Step 3: Prompt the user to add recursive logic
      setCode(`def backtracking():\n    # Step 1: Define the function\n    # Step 2: Add a base case\n    if base_case_condition:\n        return\n\n    # Step 3: Add recursive logic\n    for choice in choices:\n        make_choice()\n        backtracking()\n        undo_choice()\n`);
      setStep(3);
    } else {
      // Final Step: Solve the full problem
      setCode(`def backtracking(choices):\n    # Complete backtracking function\n    if base_case_condition:\n        return\n    for choice in choices:\n        make_choice()\n        backtracking()\n        undo_choice()\n`);
      setStep(4);
    }
  };

  return (
    <div>
      <h1>Python Backtracking Exercise</h1>
      <p>Step {step}: {step === 1 ? "Define the function" : step === 2 ? "Add base case" : step === 3 ? "Add recursive logic" : "Solve the problem"}</p>
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
      <br />
      <button onClick={handleRunCode}>Run Code</button>
      <button onClick={nextStep}>Next Step</button>
      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};

export default BacktrackingEditor;
