import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/añadir-tema');
  };

  return (
    <div className="home-container">
      <h1>Bienvenido Profesor@ "Perez"</h1>
      <div className="cards">
        <div className="card" onClick={handleCardClick}>
          <h2>Aprendizaje Supervisado</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="card" onClick={handleCardClick}>
          <h2>Aprendizaje No Supervisado</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
