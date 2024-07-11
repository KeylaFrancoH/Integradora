import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function ActualizarClienteModal({ clientId, handleClose, show }) {
  const [cliente, setCliente] = useState(null);
  const [values, setValues] = useState({
    RucDni: '',
    Nombre: '',
    Correo: '',
    Direccion: '',
    Activo: '1',
  });

  useEffect(() => {
    if (clientId) {
      axios
        .get(`http://localhost:8081/clientes/${clientId}`)
        .then((res) => {
          setCliente(res.data);
          setValues(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmUpdate = window.confirm("¿Seguro que desea continuar?");
    if (confirmUpdate) {
      axios
        .put(`http://localhost:8081/clientes/${clientId}`, values)
        .then((res) => {
          console.log(res);
          handleClose();
          window.location.reload(); 
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cliente && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="RucDni">Cédula o RUC:</label>
              <input
                type="text"
                className="form-control"
                id="RucDni"
                name="RucDni"
                value={values.RucDni}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Nombre">Nombre:</label>
              <input
                type="text"
                className="form-control"
                id="Nombre"
                name="Nombre"
                value={values.Nombre}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Correo">Correo:</label>
              <input
                type="email"
                className="form-control"
                id="Correo"
                name="Correo"
                value={values.Correo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Direccion">Dirección:</label>
              <input
                type="text"
                className="form-control"
                id="Direccion"
                name="Direccion"
                value={values.Direccion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
            <label htmlFor="Activo">Activo:</label>
            <select
              className="form-control"
              id="Activo"
              onChange={(e) => setValues({ ...values, Activo: e.target.value })}
              name="Activo"
              value={values.Activo ? "1" : "0"}
             
            >
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ActualizarClienteModal;
