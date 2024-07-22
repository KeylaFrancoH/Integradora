import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';
import Home from './components/Home/home';
import AddTopic from './components/Topics/addtopic';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/inicio" element={<Home />} />
          <Route path="/perfil" element={<div>Perfil</div>} />
          <Route path="/añadir-tema/:cursoId" element={<AddTopic />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
