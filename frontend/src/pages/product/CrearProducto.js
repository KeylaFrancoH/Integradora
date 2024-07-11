import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function CrearProducto({ show, handleClose }) {
  const [productList, setProductList] = useState([
    {
      Codigo: "",
      Nombre: "",
      Precio: "",
      Stock: "",
      Activo: "1",
    },
  ]);

  const [errors, setErrors] = useState([
    {
      Codigo: "",
      Nombre: "",
      Precio: "",
      Stock: "",
    },
  ]);

  const [errorMessage, setErrorMessage] = useState("");

  const validateInputs = () => {
    const newErrors = [...errors];
    let isValid = true;

    productList.forEach((product, index) => {
      newErrors[index] = {};

      // Validar Codigo
      if (!product.Codigo || product.Codigo.length > 15) {
        newErrors[index].Codigo = "El código debe tener máximo 15 caracteres.";
        isValid = false;
      }

      // Validar Nombre
      if (!product.Nombre) {
        newErrors[index].Nombre = "Debe ingresar un nombre.";
        isValid = false;
      }

      // Validar Precio
      if (
        !product.Precio ||
        isNaN(product.Precio) ||
        parseFloat(product.Precio) <= 0
      ) {
        newErrors[index].Precio = "Debe ingresar un precio válido.";
        isValid = false;
      }

      // Validar Stock
      if (
        !product.Stock ||
        isNaN(product.Stock) ||
        parseInt(product.Stock) <= 0 ||
        !Number.isInteger(parseFloat(product.Stock))
      ) {
        newErrors[index].Stock =
          "Debe ingresar un valor entero positivo para el stock.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    const isValid = validateInputs();
    if (isValid) {
      const confirmCreation = window.confirm(
        "¿Está seguro de que desea continuar con la creación de los productos?"
      );
      if (confirmCreation) {
        Promise.all(
          productList.map((product) => {
            return axios.post("http://localhost:8081/productos", product);
          })
        )
          .then((responses) => {
            console.log(responses);
            handleClose(); // Cierra el modal después de crear los productos
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

  const handleChange = (index, fieldName, value) => {
    const newList = [...productList];
    newList[index][fieldName] = value;
    setProductList(newList);
  };

  const addRow = () => {
    setProductList([
      ...productList,
      {
        Codigo: "",
        Nombre: "",
        Precio: "",
        Stock: "",
        Activo: "1",
      },
    ]);
    setErrors([
      ...errors,
      {
        Codigo: "",
        Nombre: "",
        Precio: "",
        Stock: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    const newProductList = [...productList];
    const newErrors = [...errors];

    newProductList.splice(index, 1);
    newErrors.splice(index, 1);

    setProductList(newProductList);
    setErrors(newErrors);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Crear Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <form>
            {errorMessage && (
              <div className="alert alert-danger mb-3" role="alert">
                {errorMessage}
              </div>
            )}
            {productList.map((product, index) => (
              <div className="row" key={index}>
                <div className="col">
                  <label
                    htmlFor={`Codigo-${index}`}
                    className="form-label me-2"
                  >
                    Código:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors[index].Codigo && "is-invalid"
                    }`}
                    id={`Codigo-${index}`}
                    placeholder="Código"
                    value={product.Codigo}
                    style={{ width: "80px" }}
                    onChange={(e) =>
                      handleChange(index, "Codigo", e.target.value)
                    }
                  />
                  {errors[index].Codigo && (
                    <div className="invalid-feedback">
                      {errors[index].Codigo}
                    </div>
                  )}
                </div>
                <div className="col">
                  <label
                    htmlFor={`Nombre-${index}`}
                    className="form-label me-2"
                  >
                    Nombre:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors[index].Nombre && "is-invalid"
                    }`}
                    id={`Nombre-${index}`}
                    placeholder="Nombre"
                    style={{ width: "500px" }}
                    value={product.Nombre}
                    onChange={(e) =>
                      handleChange(index, "Nombre", e.target.value)
                    }
                  />
                  {errors[index].Nombre && (
                    <div className="invalid-feedback">
                      {errors[index].Nombre}
                    </div>
                  )}
                </div>
                <div className="col">
                  <label
                    htmlFor={`Precio-${index}`}
                    className="form-label me-2"
                  >
                    Precio:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${
                      errors[index].Precio && "is-invalid"
                    }`}
                    id={`Precio-${index}`}
                    placeholder="Precio"
                    value={product.Precio}
                    style={{ width: "80px" }}
                    onChange={(e) =>
                      handleChange(index, "Precio", e.target.value)
                    }
                  />
                  {errors[index].Precio && (
                    <div className="invalid-feedback">
                      {errors[index].Precio}
                    </div>
                  )}
                </div>
                <div className="col">
                  <label htmlFor={`Stock-${index}`} className="form-label me-2">
                    Stock:
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors[index].Stock && "is-invalid"
                    }`}
                    id={`Stock-${index}`}
                    placeholder="Stock"
                    value={product.Stock}
                    style={{ width: "80px" }}
                    onChange={(e) =>
                      handleChange(index, "Stock", e.target.value)
                    }
                  />
                  {errors[index].Stock && (
                    <div className="invalid-feedback">
                      {errors[index].Stock}
                    </div>
                  )}
                </div>
                <div className="col">
                  <label
                    htmlFor={`Activo-${index}`}
                    className="form-label me-2"
                  >
                    Activo:
                  </label>
                  <select
                    className="form-select"
                    id={`Activo-${index}`}
                    value={product.Activo}
                    style={{ width: "80px" }}
                    onChange={(e) =>
                      handleChange(index, "Activo", e.target.value)
                    }
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div className="col d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-danger mt-auto"
                    onClick={() => deleteRow(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="success" onClick={addRow} className="mt-3">
                Agregar Más
              </Button>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CrearProducto;
