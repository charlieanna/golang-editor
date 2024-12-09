// src/components/TextFetcher/CodeEditorComponent.js

import React from 'react';
import MonacoEditor from 'react-monaco-editor';

/**
 * CodeEditorComponent
 * Wraps the Monaco Editor for code input.
 * @param {Object} props - Component props.
 */
const CodeEditorComponent = ({ code, onChange, language = 'go' }) => {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    fontSize: 14,
  };

  return (
    <MonacoEditor
      width="800"
      height="400"
      language={language}
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
    />
  );
};

export default CodeEditorComponent;
