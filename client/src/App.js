//import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import MapComponent from './Components/MapComponent';
import Login from './Components/Login';
import FrontPage from './Components/FrontPage';
import AdminPanel from './Components/AdminPanel';
//import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

