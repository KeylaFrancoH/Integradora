import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';


const Home = () => {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState('');
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios');
        const adminUser = response.data.find(user => user.idAdmin === true);
        if (adminUser) {
          setProfesor(adminUser.Nombre + " " +  adminUser.Apellido); 
        } else {
          console.warn('No admin user found');
        }
      } catch (error) {
        console.error('Error fetching usuario:', error);
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cursos');

        setCursos(response.data);
      } catch (error) {
      }
    };

    fetchUsuarios();
    fetchCursos();
  }, []);

  const handleCardClick = (cursoId,cursoTitulo) => {
    navigate(`/anadir-tema/${cursoId}`, { state: { cursoTitulo } });

  };

  return (
    <div className="home-container">
      <h1>Bienvenido Profesor@ {profesor}</h1>
      <div className="cards">
        {cursos.length > 0 ? (
          cursos.map(curso => (
            <div key={curso.idCurso} className="card" onClick={() => handleCardClick(curso.idCurso, curso.Titulo)}>
              <h2>{curso.Titulo}</h2> 
              <p>{curso.Descripcion}</p>
            </div>
          ))
        ) : (
          <p>No hay cursos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Home;
