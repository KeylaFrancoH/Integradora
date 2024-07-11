import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Detalles({ idFactura }) {
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (idFactura) {
      axios
        .get(`http://localhost:8081/detalles/facturas/${idFactura}`)
        .then((res) => {
          setDetalles(res.data);
          res.data.forEach((detalle) => {
            axios
              .get(`http://localhost:8081/productos/${detalle.idProducto}`)
              .then((res) => {
                setProductos((prevProductos) => ({
                  ...prevProductos,
                  [detalle.idProducto]: res.data,
                }));
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [idFactura]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Ver Detalles
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detalles Factura # {idFactura}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table table-striped table-bordered rounded">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID Factura</th>
                  <th scope="col">Codigo Producto</th>
                  <th scope="col">Nombre Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <tr key={detalle.idDetalle}>
                    <th scope="row">{index + 1}</th>
                    <td>{detalle.idFactura}</td>
                    <td>{productos[detalle.idProducto]?.Codigo}</td>
                    <td>{productos[detalle.idProducto]?.Nombre}</td>
                    <td>{productos[detalle.idProducto]?.Precio}</td>
                    <td>{detalle.Cantidad}</td>
                    <td>{detalle.Subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Detalles;
