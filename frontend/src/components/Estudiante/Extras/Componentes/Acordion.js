import React, { useState } from "react";
import { FaBookmark } from "react-icons/fa";

const Accordion = ({ instrucciones }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {instrucciones && (
        <div className="accordion-header" onClick={toggleAccordion}>
          <div className="nueva-vista-header">
            <FaBookmark className="nueva-vista-icon" />
            <span>Instrucciones</span>
          </div>
          <div className={`accordion-icon ${isOpen ? "open" : ""}`}>
            {isOpen ? "-" : "+"}
          </div>
        </div>
      )}
      {instrucciones && (
        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
          <p>{instrucciones}</p>
        </div>
      )}
    </>
  );
};

export default Accordion;
