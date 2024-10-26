import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GolangEditor from './GolangEditor'; // Existing Golang editor component
import WorkerPoolEditor from './WorkerPoolEditor'; // New Worker Pool exercise component
import BacktrackingEditor from './BacktrackingEditor'; // 
import BacktrackingEditorWithTree from './BacktrackingEditorWithTree';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route for the Golang Editor */}
          <Route path="/" element={<GolangEditor />} />

          {/* Route for the Worker Pool exercise */}
          <Route path="/workerpool" element={<WorkerPoolEditor />} />

           {/* Backtracking Problem in Python Route */}
           <Route path="/backtracking" element={<BacktrackingEditor />} />


          <Route path="/backtrackingtree" element={<BacktrackingEditorWithTree />} />
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
