const ContenidoEjerciciosList = ({ ejercicios }) => (
    <div className="ejercicios-container">
      <h3>Contenido de Ejercicios:</h3>
      {ejercicios.length > 0 ? (
        ejercicios.map((ejercicio) => (
          <div key={ejercicio.idContenidoEjercicios} className="ejercicio-item">
            <p>
              <strong>K Mínimo:</strong> {ejercicio.k_min}
            </p>
            <p>
              <strong>K Máximo:</strong> {ejercicio.k_max}
            </p>
            <p>
              <strong>K Exacto:</strong> {ejercicio.k_exacto}
            </p>
            <p>
              <strong>Iteración Mínima:</strong> {ejercicio.iteracion_min}
            </p>
            <p>
              <strong>Iteración Máxima:</strong> {ejercicio.iteracion_max}
            </p>
            <p>
              <strong>Iteración Exacta:</strong> {ejercicio.iteracion_exacto}
            </p>
          </div>
        ))
      ) : (
        <p>No hay contenido de ejercicios disponible.</p>
      )}
    </div>
  );

export default ContenidoEjerciciosList;