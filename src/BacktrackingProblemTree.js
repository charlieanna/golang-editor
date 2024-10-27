import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as d3 from 'd3';

// Define code snippets for each step
const codeSnippets = [
  `# Step 1: Initialize the results array inside the main function\n
def generate_subsets(nums):\n    results = []\n`,
  `# Step 2: Define the backtracking helper function\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        pass\n\n    helper([], 0)\n\n    return results`,
  `# Step 3: Pass the start parameter to the helper function\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n\n    helper([], 0)\n\n    return results`,
  `# Step 4: Implement the helper logic to backtrack\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n\n    helper([], 0)\n\n    return results`,
  `# Step 5: Full implementation of subsets generation\n
def generate_subsets(nums):\n    results = []\n\n    def helper(current, start):\n        results.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            helper(current, i + 1)\n            current.pop()\n\n    helper([], 0)\n\n    return results\n\nnums = [1, 2, 3]\nprint(generate_subsets(nums))`,
];

// Instructions for each step
const instructions = [
  "Step 1: Initialize the `results` array inside the main function.",
  "Step 2: Define the helper function `helper(current, start)` but don’t implement any logic yet.",
  "Step 3: Implement the helper to recursively append and remove elements from the current subset.",
  "Step 4: Use the `start` parameter to avoid adding duplicate subsets.",
  "Step 5: Visualize the full tree of recursive calls to show all possible subsets.",
];

// Updated tree data with safeguards
const treeDataSteps = [
  {
    name: 'helper([], 0)',
    children: [],
  },
  {
    name: 'helper([], 0)',
    children: [
      { name: 'helper([1], 1)', children: [] },
    ],
  },
  {
    name: 'helper([], 0)',
    children: [
      { name: 'helper([1], 1)', children: [{ name: 'helper([1, 2], 2)', children: [] }] },
      { name: 'helper([2], 2)', children: [] },
    ],
  },
  {
    name: 'helper([], 0)',
    children: [
      {
        name: 'helper([1], 1)',
        children: [
          { name: 'helper([1, 2], 2)', children: [{ name: 'helper([1, 2, 3], 3)', children: [] }] },
          { name: 'helper([1, 3], 3)', children: [] },
        ],
      },
      { name: 'helper([2], 2)', children: [{ name: 'helper([2, 3], 3)', children: [] }] },
      { name: 'helper([3], 3)', children: [] },
    ],
  },
];

// Main BacktrackingEditorWithTree component
const BacktrackingEditorWithTree = () => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize code and tree on the first render
  useEffect(() => {
    setCode(codeSnippets[0]);
    drawTree(treeDataSteps[0]);
  }, []);

  // Move to the next step in the tutorial
  const handleNextStep = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
      setCode(codeSnippets[step + 1]);
      drawTree(treeDataSteps[step + 1]);  // Draw next tree step
    }
  };

  // Move to the previous step in the tutorial
  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setCode(codeSnippets[step - 1]);
      drawTree(treeDataSteps[step - 1]);  // Draw previous tree step
    }
  };

  // Handle code changes in Monaco editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Run the code and get output
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

  // Draw the tree using D3.js
  const drawTree = (data) => {
    // Safeguard to prevent drawing if the data is undefined
    if (!data) return;

    // Clear any previous SVGs
    d3.select('#tree').selectAll('*').remove();

    const width = 1200;
    const height = 600;
    const svg = d3
      .select('#tree')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const root = d3.hierarchy(data, d => d.children || []);  // Safeguard for undefined children
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Draw the links
    svg
      .selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', 'black');

    // Draw the nodes
    svg
      .selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 15)
      .attr('fill', 'lightblue');

    // Add labels
    svg
      .selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text((d) => d.data.name);
  };

  return (
    <div>
      <h1>Backtracking Tutorial: Generate Subsets</h1>

      {/* Problem Description */}
      <div>
        <h2>Problem</h2>
        <p>
          Given a list of distinct integers `nums`, return all possible subsets (the power set). The solution must not contain duplicate subsets. You can return the subsets in any order.
        </p>
        <h3>Example</h3>
        <p><strong>Input:</strong> nums = [1, 2, 3]</p>
        <p><strong>Output:</strong> [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]</p>
      </div>

      {/* Tree Visualization */}
      <div id="tree"></div>

      {/* Instructions */}
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

      {/* Step Control */}
      <button onClick={handlePreviousStep} disabled={step === 0}>
        Previous
      </button>
      <button onClick={handleNextStep} disabled={step === instructions.length - 1}>
        Next
      </button>
      <button onClick={handleRunCode}>Run Code</button>

      {/* Output Section */}
      <h2>Output:</h2>
      <pre>{output}</pre>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default BacktrackingEditorWithTree;
