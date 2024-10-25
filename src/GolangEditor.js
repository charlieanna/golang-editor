import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

const GolangEditor = () => {
  const [code, setCode] = useState(`package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World")\n}`);
  const [output, setOutput] = useState('');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/execute', {
        language: 'golang',
        code: code,
      });
      const data = await response.data;
      console.log(data.output);  // Log or display the output
      setOutput(response.data.output || 'No output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(error.response ? error.response.data.error : 'Error running the code');
    }
  };

  return (
    <div>
      <h1>Golang Code Editor</h1>
      <MonacoEditor
        width="800"
        height="400"
        language="go"
        theme="vs-dark"
        value={code}
        options={{
          selectOnLineNumbers: true,
        }}
        onChange={handleCodeChange}
      />
      <br />
      <button onClick={handleRunCode}>Run Code</button>
      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};

export default GolangEditor;
