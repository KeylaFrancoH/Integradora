import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Button, Modal } from "react-bootstrap";

function ActualizarProduct({ show, handleClose, productId }) {
  const [values, setValues] = useState({
    Codigo: "",
    Nombre: "",
    Precio: "",
    Stock: "",
    Activo: true,
  });
  const [errors, setErrors] = useState({
    Codigo: "",
    Nombre: "",
    Precio: "",
    Stock: "",
  });
  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:8081/productos/${productId}`)
        .then((res) => {
          const producto = res.data;
          setValues({
            Codigo: producto.Codigo,
            Nombre: producto.Nombre,
            Precio: producto.Precio,
            Stock: producto.Stock,
            Activo: producto.Activo,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
 

  const [errorMessage, setErrorMessage] = useState("");

  const validateInputs = () => {
    const newErrors = { ...errors };

    // Validar Codigo
    if (!values.Codigo || values.Codigo.length > 15) {
      newErrors.Codigo = "El código debe tener máximo 15 caracteres.";
    } else {
      newErrors.Codigo = "";
    }

    // Validar Nombre
    if (!values.Nombre) {
      newErrors.Nombre = "Debe ingresar un nombre.";
    } else {
      newErrors.Nombre = "";
    }

    // Validar Precio
    if (
      !values.Precio ||
      isNaN(values.Precio) ||
      parseFloat(values.Precio) <= 0
    ) {
      newErrors.Precio = "Debe ingresar un precio válido.";
    } else {
      newErrors.Precio = "";
    }

    // Validar Stock
    if (
      !values.Stock ||
      isNaN(values.Stock) ||
      parseInt(values.Stock) < 0 ||
      !Number.isInteger(parseFloat(values.Stock))
    ) {
      newErrors.Stock = "Debe ingresar un valor entero positivo para el stock.";
    } else {
      newErrors.Stock = "";
    }

    setErrors(newErrors);

    // Retorna true si no hay errores
    return Object.values(newErrors).every((error) => error === "");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (isValid) {
      const activo = parseInt(values.Stock) > 0;
      setValues({ ...values, Activo: activo });

      const confirmCreation = window.confirm(
        "¿Está seguro de que desea continuar con la creación del producto?"
      );
      if (confirmCreation) {
        axios
          .put(`http://localhost:8081/productos/${productId}`, values)
          .then((res) => {
            console.log(res);
            handleClose();
            window.location.href = "/Productos";
          })
          .catch((err) => {
            if (err.response && err.response.status === 400) {
              setErrorMessage(err.response.data.message);
            } else {
              console.log(err);
            }
          });
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="Codigo">Código del producto:</label>
            <input
              type="text"
              className="form-control"
              id="Codigo"
              name="Codigo"
              value={values.Codigo}
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
            <label htmlFor="Precio">Precio:</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="Precio"
              name="Precio"
              value={values.Precio}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Stock">Stock:</label>
            <input
              type="number"
              className="form-control"
              id="Stock"
              name="Stock"
              value={values.Stock}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Activo">Activo:</label>
            <select
              className="form-control"
              id="Activo"
              name="Activo"
              value={values.Activo ? "1" : "0"}
              onChange={handleChange}
            >
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ActualizarProduct;
