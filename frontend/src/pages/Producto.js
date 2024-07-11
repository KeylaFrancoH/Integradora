import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import CrearProducto from "./product/CrearProducto";
import ActualizarProduct from "./product/ActualizarProduct";

function Producto() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showActualizarModal, setShowActualizarModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleCloseCrear = () => setShowCrearModal(false);
  const handleShowCrear = () => setShowCrearModal(true);

  const handleCloseActualizar = () => setShowActualizarModal(false);
  const handleShowActualizar = (productId) => {
    setSelectedProductId(productId);
    setShowActualizarModal(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/productos")
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProductos = productos.filter(
    (producto) =>
      producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar este producto?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:8081/productos/${id}`)
        .then((res) => window.location.reload())
        .catch((err) => {
          if (err.response && err.response.status === 500) {
            alert(
              "No se puede eliminar este producto porque está asociado a una factura."
            );
          } else {
            console.log(err);
          }
        });
    }
  };

  return (
    <div className="productos">
      <div className="d-flex justify-content-center py-2 shadow-sm fs-2 fw-bold">
        PRODUCTOS
      </div>
      <div className="container mt-5">
        <div className="table-responsive">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div
              className="input-group rounded me-2"
              style={{ maxWidth: "500px" }}
            >
              <input
                type="search"
                className="form-control rounded"
                placeholder="Buscar producto..."
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={handleSearch}
              />
            </div>
            <Button variant="primary" onClick={handleShowCrear}>
              Crear Producto
            </Button>
          </div>
          <CrearProducto show={showCrearModal} handleClose={handleCloseCrear} />
          <ActualizarProduct
            show={showActualizarModal}
            handleClose={handleCloseActualizar}
            productId={selectedProductId}
          />
          {productos.length !== 0 ? (
            <table className="table table-striped table-bordered rounded">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Activo</th>
                  <th scope="col">Fecha Creación</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto, index) => (
                  <tr key={producto.idProducto}>
                    <th scope="row">{index + 1}</th>
                    <td>{producto.Codigo}</td>
                    <td>{producto.Nombre}</td>
                    <td>{producto.Precio}</td>
                    <td>{producto.Stock}</td>
                    <td>{producto.Activo ? "Activo" : "Inactivo"}</td>
                    <td>{producto.FechaCreacion}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          handleShowActualizar(producto.idProducto)
                        }
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(producto.idProducto)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-danger" role="alert">
              No se encontraron productos para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Producto;
