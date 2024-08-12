const CardEjercicio = ({ titulo, enunciado }) => {
  const tituloEjercicio = titulo;
  const enunciadoD = enunciado;
  return (
    <div className="cardEjercicio">
      <div className="cardHeader">
        <h2 style={{ textAlign: "center" }}>{tituloEjercicio}</h2>
      </div>
      <div style={{marginBottom : '3rem'}}>
      <hr className="divider" />
      <p>{enunciadoD}</p>
      <hr className="divider" />
      </div>
    
    </div>
  );
};

export default CardEjercicio;
