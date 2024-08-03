import React, { useState, useEffect } from 'react';
import './temas.css';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher } from 'react-icons/fa';
import axios from 'axios';

const AccordionItem = ({ courseTitle, temas }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleTemaClick = (temaId, temaTitle) => {
    navigate(`/estudiante/contenido`, { state: { courseTitle, temaId, temaTitle } });
  };

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className="nueva-vista-header">
          <FaChalkboardTeacher className="nueva-vista-icon" />
          <span>{courseTitle}</span>
        </div>
        <div className={`accordion-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '-' : '+'}
        </div>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        {temas.map((tema, index) => (
          <React.Fragment key={index}>
            <div
              className="tema-item"
              onClick={() => handleTemaClick(tema.idTema, tema.Titulo)}
            >
              <div className="tema-title">{tema.Titulo}</div>
            </div>
            {index < temas.length - 1 && <hr className="tema-divider" />}
          </React.Fragment>
        ))}
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
          courseTitle={item.courseTitle}
          temas={item.temas}
        />
      ))}
    </div>
  );
};

const Temas = () => {
  const [accordionData, setAccordionData] = useState([]);

  useEffect(() => {
    const fetchCursosYTemas = async () => {
      try {
        const cursosResponse = await axios.get('http://localhost:3000/api/cursos');
        const cursos = cursosResponse.data;

        const temasResponse = await axios.get('http://localhost:3000/api/temas');
        const temas = temasResponse.data;

        const data = cursos.map(curso => {
          const cursoTemas = temas.filter(tema => tema.idCurso === curso.idCurso);

          return {
            courseTitle: curso.Titulo,
            temas: cursoTemas
          };
        });

        setAccordionData(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchCursosYTemas();
  }, []);

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
