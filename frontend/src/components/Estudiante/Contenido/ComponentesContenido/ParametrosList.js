const ParametrosList = ({ parametros }) => {
    const parametrosElements = [];
  
    if (parametros.length > 0) {
      parametros.forEach((parametro) => {
        const {
          idParametro,
          formula,
          parametro_regularización,
          intercepto,
          metodo_inicialización,
          numero_clusters,
          numero_iteraciones,
        } = parametro;
  
        parametrosElements.push(
          <div key={idParametro} className="parametro-item">
            <p>
              <strong>Fórmula:</strong> {formula}
            </p>
            <p>
              <strong>Regularización:</strong> {parametro_regularización}
            </p>
            <p>
              <strong>Intercepto:</strong> {intercepto ? "Sí" : "No"}
            </p>
            <p>
              <strong>Método de Inicialización:</strong> {metodo_inicialización}
            </p>
            <p>
              <strong>Número de Clusters:</strong> {numero_clusters}
            </p>
            <p>
              <strong>Número de Iteraciones:</strong> {numero_iteraciones}
            </p>
          </div>
        );
      });
    }
  
    return (
      <div className="parametros-container">
        <h3>Parámetros:</h3>
        {parametrosElements.length > 0 ? (
          parametrosElements
        ) : (
          <p>No hay parámetros disponibles.</p>
        )}
      </div>
    );
  };

  export default ParametrosList;