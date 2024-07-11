import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import TablaModal from "./factura/detalles";

function Factura() {

  const [factura, setFacturas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/facturas")
      .then((res) => {
        setFacturas(res.data);
        // Obtener la información del cliente para cada factura
        res.data.forEach((factura) => {
          axios
            .get(`http://localhost:8081/clientes/${factura.idCliente}`)
            .then((res) => {
              // Agregar la información del cliente al estado
              setClientes((prevClientes) => ({
                ...prevClientes,
                [factura.idFactura]: res.data,
              }));
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filtered = factura.filter((fact) => {
    const numeroFactura = fact.NumeroFactura.toString()
      .padStart(5, "0")
      .toLowerCase();
    const nombreCliente = clientes[fact.idFactura]?.Nombre.toLowerCase();
    return (
      numeroFactura.includes(searchTerm) ||
      (nombreCliente && nombreCliente.includes(searchTerm))
    );
  });

  const handleDelete = async (idFactura) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar esta factura?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8081/detalles/facturas/${idFactura}`
        );
        await axios.delete(`http://localhost:8081/facturas/${idFactura}`);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="facturas">
      <div className="d-flex justify-content-center py-2 shadow-sm fs-2 fw-bold">
        FACTURAS
      </div>
      <div className="container mt-5">
        <div className="table-responsive">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div
              className="input-group rounded me-2"
              style={{ maxWidth: "1000px" }}
            >
              <input
                type="search"
                className="form-control rounded"
                placeholder="Buscar cliente..."
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={handleSearch}
              />
            </div>
            <Link to="/Facturacion/Crear" className="btn btn-primary">
              Nueva Factura
            </Link>
          </div>

          {filtered.length !== 0 ? (
            <table className="table table-striped table-bordered rounded">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"># Factura</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">RucDni</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Total</th>
                  <th scope="col">Ver Detalle</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((fact, index) => (
                  <tr key={fact.idFactura}>
                    <th scope="row">{index + 1}</th>
                    <td>{fact.NumeroFactura.toString().padStart(5, "0")}</td>
                    <td>{clientes[fact.idFactura]?.Nombre}</td>
                    <td>{clientes[fact.idFactura]?.RucDni}</td>
                    <td>{clientes[fact.idFactura]?.Correo}</td>
                    <td>{fact.Total}</td>
                    <td>
               

                      <TablaModal show={showModal} handleClose={handleClose} idFactura={fact.idFactura} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(fact.idFactura)}
                        className="btn btn-danger btn-sm"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-danger" role="alert">
              No se encontraron facturas para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Factura;
