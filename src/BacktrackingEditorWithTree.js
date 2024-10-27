import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as d3 from 'd3';
import { codeSnippets, instructions, treeDataFull, treeDataSteps } from './backtrackingData';

const BacktrackingEditorWithTree = () => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setCode(codeSnippets[0]);
    drawTree(treeDataFull);
  }, []);

  const handleNextStep = () => {
    if (step < instructions.length - 1) {
      setStep(step + 1);
      setCode(codeSnippets[step + 1]);
      drawTree(treeDataSteps[step + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setCode(codeSnippets[step - 1]);
      drawTree(treeDataSteps[step - 1]);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

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

  const drawTree = (data) => {
    if (!data) return;

    d3.select('#tree').selectAll('*').remove();

    const width = 500;
    const height = 300;
    const svg = d3.select('#tree').append('svg').attr('width', width).attr('height', height);

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    svg.selectAll('line').data(root.links()).enter().append('line').attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y).attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y).attr('stroke', 'black');
    svg.selectAll('circle').data(root.descendants()).enter().append('circle').attr('cx', (d) => d.x).attr('cy', (d) => d.y).attr('r', 10).attr('fill', 'lightblue');
    svg.selectAll('text').data(root.descendants()).enter().append('text').attr('x', (d) => d.x).attr('y', (d) => d.y).attr('dy', -10).attr('text-anchor', 'middle').text((d) => d.data.name);
  };

  return (
    <div>
      <h1>Backtracking Exercise: Generate Subsets</h1>
      <div>
        <h2>Problem</h2>
        <p>Given a list of distinct integers `nums`, return all possible subsets (the power set). You can return the subsets in any order.</p>
        <h3>Example</h3>
        <p><strong>Input:</strong> nums = [1, 2, 3]</p>
        <p><strong>Output:</strong> [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]</p>
      </div>
      <div id="tree"></div>
      <p>{instructions[step]}</p>
      <MonacoEditor width="800" height="400" language="python" theme="vs-dark" value={code} options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }} onChange={handleCodeChange} />
      <button onClick={handlePreviousStep} disabled={step === 0}>Previous</button>
      <button onClick={handleNextStep} disabled={step === instructions.length - 1}>Next</button>
      <button onClick={handleRunCode}>Run Code</button>
      <h2>Output:</h2>
      <pre>{output}</pre>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default BacktrackingEditorWithTree;
