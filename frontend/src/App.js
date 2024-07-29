import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';
import Home from './components/Home/home';
import AddTopic from './components/Topics/addtopic';
import Grafica from './components/Grafica/grafica';
import './App.css';
import { MantineProvider } from '@mantine/core';
import EstudianteHome from './components/Estudiante/estudiantehome';
import Navbar2 from './components/Estudiante/navbar';
import Tema from './components/Estudiante/temas';
import Contenido from './components/Estudiante/contenido';

const EstudianteLayout = ({ children }) => (
  <div>
    <Navbar2 />
    {children}
  </div>
);

const App = () => {
  return (
    <MantineProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<><NavBar /><Home /></>} />
            <Route path="/perfil" element={<><NavBar /><div>Perfil</div></>} />
            <Route path="/anadir-tema/:idCurso" element={<><NavBar /><AddTopic /></>} />
            <Route path="/anadir-tema/:idCurso/grafica" element={<><NavBar /><Grafica /></>} />
            <Route path="/estudiante/*" element={
              <EstudianteLayout>
                <Routes>
                  <Route path="/" element={<EstudianteHome />} />
                  <Route path="/temas" element={<Tema/>} />
                  <Route path="/contenido" element={<Contenido/>} />
                </Routes>
              </EstudianteLayout>
            } />
          </Routes>
        </div>
      </Router>
    </MantineProvider>
  );
};

export default App;
