import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function CrearCliente({ show, handleClose }) {
  const [values, setValues] = useState({
    RucDni: "",
    Nombre: "",
    Correo: "",
    Direccion: "",
    Activo: "1",
  });

  const [errors, setErrors] = useState({
    RucDni: "",
    Nombre: "",
    Correo: "",
    Direccion: "",
  });

  const validateInputs = () => {
    const newErrors = { ...errors };

    // Validar RucDni
    if (!values.RucDni || isNaN(values.RucDni) || values.RucDni.length !== 10) {
      newErrors.RucDni = "Debe ingresar un RUC o DNI válido de 10 dígitos";
    } else {
      newErrors.RucDni = "";
    }

    // Validar Nombre
    if (!values.Nombre) {
      newErrors.Nombre = "Debe ingresar un nombre";
    } else {
      newErrors.Nombre = "";
    }

    // Validar Correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.Correo || !correoRegex.test(values.Correo)) {
      newErrors.Correo = "Debe ingresar un correo electrónico válido";
    } else {
      newErrors.Correo = "";
    }

    // Validar Direccion
    if (!values.Direccion) {
      newErrors.Direccion = "Debe ingresar una dirección";
    } else {
      newErrors.Direccion = "";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (isValid) {
      const confirmCreation = window.confirm(
        "¿Está seguro de que desea continuar con la creación del usuario?"
      );
      if (confirmCreation) {
        axios
          .post("http://localhost:8081/clientes/create", values)
          .then((res) => {
            console.log(res);
            handleClose();
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="RucDni">Cédula o RUC:</label>
              <input
                type="text"
                className={`form-control ${errors.RucDni && "is-invalid"}`}
                id="RucDni"
                placeholder="Numero de cedula"
                onChange={(e) =>
                  setValues({ ...values, RucDni: e.target.value })
                }
              />
              {errors.RucDni && (
                <div className="invalid-feedback">{errors.RucDni}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="Nombre">Nombre:</label>
              <input
                type="text"
                className={`form-control ${errors.Nombre && "is-invalid"}`}
                id="Nombre"
                placeholder="Nombre "
                onChange={(e) =>
                  setValues({ ...values, Nombre: e.target.value })
                }
              />
              {errors.Nombre && (
                <div className="invalid-feedback">{errors.Nombre}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="Correo">Correo:</label>
              <input
                type="email"
                className={`form-control ${errors.Correo && "is-invalid"}`}
                id="Correo"
                placeholder="Email"
                onChange={(e) =>
                  setValues({ ...values, Correo: e.target.value })
                }
              />
              {errors.Correo && (
                <div className="invalid-feedback">{errors.Correo}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="Direccion">Dirección:</label>
              <input
                type="text"
                className={`form-control ${errors.Direccion && "is-invalid"}`}
                id="Direccion"
                placeholder="Dirección"
                onChange={(e) =>
                  setValues({ ...values, Direccion: e.target.value })
                }
              />
              {errors.Direccion && (
                <div className="invalid-feedback">{errors.Direccion}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="Activo">Activo:</label>
              <select
                className="form-select me-2"
                aria-label="Default select example"
                id="Activo"
                onChange={(e) =>
                  setValues({ ...values, Activo: e.target.value })
                }
                style={{ width: "100px" }}
              >
                <option selected>¿Activo? </option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CrearCliente;
