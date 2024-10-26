import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

const CodeEditor = () => {
  const [language, setLanguage] = useState('golang'); // Default language: Go
  const [code, setCode] = useState({
    golang: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World")\n}`,
    python: `print("Hello, World!")`,
  });
  const [output, setOutput] = useState('');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (newCode) => {
    setCode((prevState) => ({
      ...prevState,
      [language]: newCode, // Update code for the selected language
    }));
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/execute', {
        language: language,
        code: code[language],
      });
      const data = response.data;
      setOutput(data.output || 'No output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(error.response ? error.response.data.error : 'Error running the code');
    }
  };

  return (
    <div>
      <h1>Code Editor</h1>

      <label htmlFor="language-select">Choose Language:</label>
      <select id="language-select" value={language} onChange={handleLanguageChange}>
        <option value="golang">Golang</option>
        <option value="python">Python</option>
      </select>

      <MonacoEditor
        width="800"
        height="400"
        language={language === 'golang' ? 'go' : 'python'}
        theme="vs-dark"
        value={code[language]}
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
      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
};

export default CodeEditor;
