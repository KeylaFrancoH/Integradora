import { exp } from "@tensorflow/tfjs-core";

const PointsList = ({ points }) => {
    const pointsElements = [];
  
    if (points.length > 0) {
      points.forEach((point) => {
        const { idPuntos, punto_X, punto_Y } = point;
  
        pointsElements.push(
          <div key={idPuntos} className="point-item">
            <p>
              <strong>Ubicación X:</strong> {punto_X}
            </p>
            <p>
              <strong>Ubicación Y:</strong> {punto_Y}
            </p>
          </div>
        );
      });
    }
  
    return (
      <div className="points-container">
        <h3>Puntos:</h3>
        {pointsElements.length > 0 ? (
          pointsElements
        ) : (
          <p>No hay puntos disponibles.</p>
        )}
      </div>
    );
  };

  export default PointsList;