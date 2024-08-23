import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Home from './components/Home/index.js'; // Ensure the path to Home is correct

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
