import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as d3 from 'd3';

// Define code snippets for each step
const codeSnippets = [
  `# Step 1: Define the function and a helper (backtrack) inside it\n
def generate_subsets(nums):\n    result = []\n\n    def backtrack(current, start):\n        result.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            backtrack(current, i + 1)\n            current.pop()\n\n    backtrack([], 0)\n    return result\n`,
  `# Step 2: Complete the backtracking logic with function call\n
def generate_subsets(nums):\n    result = []\n\n    def backtrack(current, start):\n        result.append(current[:])  # Add the current subset to the result\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            backtrack(current, i + 1)  # Recursive call\n            current.pop()  # Undo the last step\n\n    backtrack([], 0)  # Call the helper function inside the main function\n    return result\n`,
  `# Step 3: Call the function and print the result\n
nums = [1, 2, 3]\nprint(generate_subsets(nums))`,
];

// Instructions for each step
const instructions = [
  "Step 1: First, define the main function and the helper function (`backtrack`) inside it.",
  "Step 2: Now, complete the backtracking logic by appending, recursively calling, and removing elements.",
  "Step 3: Finally, call the main function and generate all subsets of a list.",
];

// BacktrackingEditorWithTree component
const BacktrackingEditorWithTree = () => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize code and tree with the first step
  useEffect(() => {
    setCode(codeSnippets[0]);
    drawTree(treeDataSteps[0]);  // Call to draw initial tree
  }, []);

  // Move to the next step in the exercise
  const handleNextStep = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
      setCode(codeSnippets[step + 1]);
      drawTree(treeDataSteps[step + 1]);  // Update the tree for the next step
    }
  };

  // Move to the previous step in the exercise
  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setCode(codeSnippets[step - 1]);
      drawTree(treeDataSteps[step - 1]);  // Update the tree for the previous step
    }
  };

  // Handle code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Function to run the code and get output
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

  // Function to draw the tree using D3.js
  const drawTree = (data) => {
    if (!data) return; // Safeguard for undefined tree data

    // Clear the previous SVG if exists
    d3.select('#tree').selectAll('*').remove();

    const width = 500;
    const height = 300;
    const svg = d3
      .select('#tree')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Draw the links between nodes
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
      .attr('r', 10)
      .attr('fill', 'lightblue');

    // Add labels to the nodes
    svg
      .selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .text((d) => d.data.name);
  };

  // Initial tree data (for step 1)
  const initialTreeData = {
    name: '[]',
    children: [
      {
        name: '[1]',
        children: [
          { name: '[1, 2]', children: [{ name: '[1, 2, 3]', children: [] }] },
          { name: '[1, 3]', children: [] },
        ],
      },
      {
        name: '[2]',
        children: [{ name: '[2, 3]', children: [] }],
      },
      {
        name: '[3]',
        children: [],
      },
    ],
  };

  // Tree data steps to show progression
  const treeDataSteps = [
    initialTreeData,
    {
      name: '[]',
      children: [
        {
          name: '[1]',
          children: [
            { name: '[1, 2]', children: [{ name: '[1, 2, 3]', children: [] }] },
            { name: '[1, 3]', children: [] },
          ],
        },
        {
          name: '[2]',
          children: [{ name: '[2, 3]', children: [] }],
        },
        {
          name: '[3]',
          children: [],
        },
      ],
    },
  ];

  return (
    <div>
      <h1>Backtracking Exercise: Generate Subsets</h1>
      <p>{instructions[step]}</p>

      {/* Tree Visualization */}
      <div id="tree"></div>

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

      <br />

      {/* Navigation Buttons */}
      <button onClick={handlePreviousStep} disabled={step === 0}>
        Previous
      </button>
      <button onClick={handleNextStep} disabled={step === instructions.length - 1}>
        Next
      </button>
      <button onClick={handleRunCode}>Run Code</button>

      <h2>Output:</h2>
      {output && <pre>{output}</pre>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default BacktrackingEditorWithTree;
