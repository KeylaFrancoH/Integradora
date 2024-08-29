import {
    FaShareAlt,
    FaExternalLinkAlt,
  } from "react-icons/fa";

const EnlacesConsulta = ({ enlaces }) => {
    const handleShare = (enlace) => {
      if (navigator.share) {
        navigator
          .share({
            title: "Consulta Enlace",
            url: enlace,
          })
          .then(() => console.log("Enlace compartido exitosamente"))
          .catch((error) => console.error("Error al compartir:", error));
      } else {
        alert(
          "La funcionalidad de compartir no está disponible en este navegador."
        );
      }
    };
  
    const handleOpenLink = (enlace) => {
      window.open(enlace, "_blank", "noopener,noreferrer");
    };
  
    return (
      <div>
        {enlaces.length > 0 ? (
          enlaces.map((enlace, index) => (
            <div key={index} className="enlace-card">
              <a className="enlace">{enlace.Enlace}</a>
              <div className="button-container">
                <button
                  className="share-button"
                  onClick={() => handleShare(enlace.Enlace)}
                >
                  <FaShareAlt />
                </button>
                <button
                  className="open-button"
                  onClick={() => handleOpenLink(enlace.Enlace)}
                >
                  <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No hay enlaces disponibles.</div>
        )}
      </div>
    );
  };

  export default EnlacesConsulta;