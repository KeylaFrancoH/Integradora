import React, { useState } from 'react';
import './temas.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher } from 'react-icons/fa';

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
  const accordionData = [
    {
      title: 'Sección 1',
      content: 'Contenido de la sección 1'
    },
    {
      title: 'Sección 2',
      content: 'Contenido de la sección 2'
    },
    {
      title: 'Sección 3',
      content: 'Contenido de la sección 3'
    }
  ];

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
