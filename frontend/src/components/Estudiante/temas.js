import React, { useState, useEffect } from 'react';
import './temas.css';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher } from 'react-icons/fa';
import axios from 'axios';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className="nueva-vista-header">
          <FaChalkboardTeacher className="nueva-vista-icon" />
          <span>{title}</span>
        </div>
        <div className={`accordion-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '-' : '+'}
        </div>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        {content}
      </div>
    </div>
  );
};

const Accordion = ({ data }) => {
  return (
    <div className="accordion">
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
        />
      ))}
    </div>
  );
};

const Temas = () => {
  const [accordionData, setAccordionData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursosYTemas = async () => {
      try {
        // Obtener los cursos
        const cursosResponse = await axios.get('http://localhost:3000/api/cursos');
        const cursos = cursosResponse.data;

        // Obtener los temas
        const temasResponse = await axios.get('http://localhost:3000/api/temas');
        const temas = temasResponse.data;

        // Integrar los datos
        const data = cursos.map(curso => {
          const cursoTemas = temas
            .filter(tema => tema.idCurso === curso.idCurso)
            .map((tema, index) => (
              <React.Fragment key={index}>
                <div
                  className="tema-item"
                  onClick={() => navigate(`/estudiante/contenido`, { state: { idTema: tema.idTema } })}
                >
                  <div className="tema-title">{tema.Titulo}</div>
                </div>
                {index < temas.filter(tema => tema.idCurso === curso.idCurso).length - 1 && <hr className="tema-divider" />}
              </React.Fragment>
            ));

          return {
            title: curso.Titulo,
            content: <div>{cursoTemas}</div>
          };
        });

        setAccordionData(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchCursosYTemas();
  }, [navigate]);

  return (
    <div className="nueva-vista-container">
      <div className="header-container">
        <h1 className="clases">Temas</h1>
        <div className="underline"></div>
      </div>
      <Accordion data={accordionData} />
    </div>
  );
};

export default Temas;
