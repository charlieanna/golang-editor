import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GolangEditor from './GolangEditor'; // Existing Golang editor component
import WorkerPoolEditor from './WorkerPoolEditor'; // New Worker Pool exercise component
import BacktrackingProblemTree from './BacktrackingProblemTree';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<GolangEditor />} />
          <Route path="/workerpool" element={<WorkerPoolEditor />} />
          <Route path="/backtrackingproblemtree" element={<BacktrackingProblemTree />} />           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
