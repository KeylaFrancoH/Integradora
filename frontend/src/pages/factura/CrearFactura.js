import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import CrearCliente from "../client/crearCliente";
import "./factura.css";

let clienteSeleccionado = null;
let productoSeleccionado = null;

function CrearFactura() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ultimoNumeroFactura, setUltimoNumeroFactura] = useState(0);
  const [camposCompletos, setCamposCompletos] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [facturaData, setFacturaData] = useState({
    razonSocial: "",
    ruc: "",
    numero: "",
    fecha: "",
    correo: "",
    subtotal: 0,
    porcentajeIGV: 0.12,
    igv: 0,
    total: 0,
    items: [],
  });

  const [nuevoItem, setNuevoItem] = useState({
    idFactura: "",
    idProducto: "",
    precio: "0.00",
    cantidad: 1,
    codigoProducto: "",
    subtotal: 0,
  });

  useEffect(() => {
    // Obtener el último número de factura al cargar el componente
    axios
      .get("http://localhost:8081/facturas")
      .then((res) => {
        if (res.data.length > 0) {
          const ultimoNumero = res.data[res.data.length - 1].idFactura;
          setUltimoNumeroFactura(ultimoNumero + 1);

          setFacturaData({ ...facturaData, numero: ultimoNumero + 1 });
        } else {
          setUltimoNumeroFactura(1); 
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Obtener la lista de clientes al cargar el componente
    axios
      .get("http://localhost:8081/clientes")
      .then((res) => {
        const clientesActivos = res.data.filter(
          (cliente) => cliente.Activo === true
        );
        setClientes(clientesActivos);
      })
      .catch((err) => {
        console.log(err);
      });

    // Obtener la lista de productos al cargar el componente
    axios
      .get("http://localhost:8081/productos")
      .then((res) => {
        const productosActivos = res.data.filter(
          (product) => product.Activo === true && product.Stock > 0
        );
        setProductos(productosActivos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (
      facturaData.razonSocial &&
      facturaData.ruc &&
      facturaData.items.length > 0
    ) {
      setCamposCompletos(true);
    } else {
      setCamposCompletos(false);
    }
  }, [facturaData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacturaData({ ...facturaData, [name]: value });
  };

  const handleChangeCliente = (e) => {
    const clienteId = e.target.value;
    axios
      .get(`http://localhost:8081/clientes/${clienteId}`)
      .then((res) => {
        clienteSeleccionado = res.data;
        setFacturaData((prevFacturaData) => ({
          ...prevFacturaData,
          razonSocial: clienteSeleccionado["Nombre"],
          ruc: clienteSeleccionado["RucDni"],
          correo: clienteSeleccionado["Correo"],
          numero: ultimoNumeroFactura,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeProducto = (e) => {
    const productoId = e.target.value;

    axios
      .get(`http://localhost:8081/productos/${productoId}`)
      .then((res) => {
        productoSeleccionado = res.data;
        setNuevoItem({
          ...nuevoItem,
          idProducto: productoSeleccionado["idProducto"],
          precio: productoSeleccionado["Precio"],
          codigoProducto: productoSeleccionado["Codigo"],
          nombreProducto: productoSeleccionado["Nombre"],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddItem = () => {
    const productoSeleccionado = productos.find(
      (producto) => producto.idProducto === nuevoItem.idProducto
    );
    const stockDisponible = productoSeleccionado
      ? productoSeleccionado.Stock
      : 0;

    if (nuevoItem.cantidad > stockDisponible) {
      alert(
        `No hay suficiente stock disponible. Stock actual: ${stockDisponible}`
      );
      return;
    }

    if (nuevoItem.cantidad <= 0) {
      alert("La cantidad debe ser mayor que 0.");
      return;
    }

    const newItem = {
      ...nuevoItem,
      idFactura: facturaData.numero,
      subtotal: parseFloat(nuevoItem.precio) * nuevoItem.cantidad,
    };

    setFacturaData((prevFacturaData) => ({
      ...prevFacturaData,
      items: [...prevFacturaData.items, newItem],
    }));

    setNuevoItem({
      ...nuevoItem,
      idProducto: "",
      precio: "0.00",
      cantidad: 1,
      codigoProducto: "",
      subtotal: 0,
    });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = facturaData.items.filter((item, i) => i !== index);
    setFacturaData({ ...facturaData, items: updatedItems });
  };

  const handlePrecioChange = (index, newPrecio) => {
    if (!isNaN(newPrecio) && newPrecio !== "") {
      const updatedItems = [...facturaData.items];
      updatedItems[index].precio = newPrecio;
      updatedItems[index].subtotal =
        parseFloat(newPrecio) * updatedItems[index].cantidad;
      setFacturaData({ ...facturaData, items: updatedItems });
    }
  };

  const handleCantidadChange = (index, newCantidad) => {
    if (newCantidad > 0) {
      const updatedItems = [...facturaData.items];
      updatedItems[index].cantidad = newCantidad;
      updatedItems[index].subtotal =
        parseFloat(updatedItems[index].precio) * newCantidad;
      setFacturaData({ ...facturaData, items: updatedItems });
    }
  };

  const calcularSubtotal = () => {
    return facturaData.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const calcularIGV = () => {
    const subtotal = calcularSubtotal();
    const porcentajeIGV = 0.12;
    return subtotal.toFixed(2) * porcentajeIGV.toFixed(2);
  };

  const calcularTotal = () => {
    return (calcularSubtotal() + calcularIGV()).toFixed(2);
  };

  const handleSaveFactura = () => {
    // Verificar si los campos obligatorios están llenos y si hay al menos un producto en la tabla
    if (!camposCompletos) {
      alert(
        "Por favor complete todos los campos obligatorios y agregue al menos un producto."
      );
      return;
    }

    // Mostrar mensaje de confirmación
    const confirmacion = window.confirm("¿Está seguro de continuar?");

    // Proceder si se responde afirmativamente o se acepta
    if (confirmacion) {
      // Calcular subtotal, IGV y total
      const subtotal = calcularSubtotal();
      const porcentajeIGV = 0.12;
      const igv = subtotal * porcentajeIGV;
      const total = subtotal + igv;

      // Crear objeto de factura
      const factura = {
        NumeroFactura: ultimoNumeroFactura,
        idCliente: clienteSeleccionado["idCliente"],
        Subtotal: subtotal.toFixed(2),
        PorcentajeIGV: facturaData.porcentajeIGV.toFixed(2),
        IGV: igv.toFixed(2),
        Total: total.toFixed(2),
      };

      // Enviar POST a la ruta de facturas
      axios
        .post("http://localhost:8081/facturas", factura)
        .then((response) => {
          console.log("Factura creada:", response.data);

          // Una vez creada la factura, enviar los detalles de los ítems
          facturaData.items.forEach((item) => {
            axios
              .post("http://localhost:8081/detalles", {
                idFactura: response.data.idFactura,
                idProducto: item.idProducto,
                Cantidad: item.cantidad,
                Subtotal: item.subtotal.toFixed(2),
              })
              .then((response) => {
                console.log("Detalles de factura creados:", response.data);
              })
              .catch((error) => {
                console.error("Error al crear detalles de factura:", error);
              });

            // Obtener el producto correspondiente
            const productoSeleccionado = productos.find(
              (producto) => producto.idProducto === item.idProducto
            );

            // Actualizar el stock del producto
            const newStock = productoSeleccionado.Stock - item.cantidad;
            console.log("Nuevo stock:", newStock);
            axios
              .put(`http://localhost:8081/productos/${item.idProducto}`, {
                Nombre: productoSeleccionado["Nombre"],
                Codigo: productoSeleccionado["Codigo"],
                Precio: productoSeleccionado["Precio"],
                Stock: newStock,
                Activo: productoSeleccionado["Activo"],
              })
              .then((response) => {
                console.log("Stock actualizado:", response.data);
              })
              .catch((error) => {
                console.error(
                  "Error al actualizar el stock del producto:",
                  error
                );
              });
          });
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error al crear factura:", error);
        });
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center py-2 shadow-sm fs-2 fw-bold">
        FACTURACIÓN
      </div>

      <header className="mt-5">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span>
              <strong>Factura N. </strong>&nbsp;
            </span>
            <input
              type="text"
              className="form-control me-2"
              style={{ width: "70px", borderRadius: "0.25rem" }}
              placeholder="N.de Factura"
              name="numero"
              value={ultimoNumeroFactura}
              readOnly
            />
            <select
              className="form-select me-2"
              aria-label="Default select example"
              onChange={(e) => handleChangeCliente(e)}
              style={{ width: "500px" }}
            >
              <option selected>Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.Nombre}
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" onClick={handleShow}>
            Crear Cliente
          </Button>
          <CrearCliente show={showModal} handleClose={handleClose} />
        </div>
      </header>

      <div className="cabecera-factura mt-5">INFORMACIÓN DEL CLIENTE</div>
      <div className="row mt-5">
        <div className="col-md-4">
          <label htmlFor="ruc" className="form-label">
            <strong>RUC del cliente *</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="ruc"
            placeholder="Ingrese el RUC del cliente"
            name="ruc"
            value={facturaData.ruc}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="razonSocial" className="form-label">
            <strong>Razón social del cliente *</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="razonSocial"
            placeholder="Ingrese la razón social del cliente"
            name="razonSocial"
            value={facturaData.razonSocial}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="correo" className="form-label">
            <strong>Correo *</strong>
          </label>
          <input
            type="email"
            className="form-control"
            id="correo"
            placeholder="Ingrese el correo del cliente"
            name="correo"
            value={facturaData.correo}
            onChange={handleInputChange}
            readOnly
          />
        </div>
      </div>

      <div className="cabecera-factura mt-5">INFORMACIÓN DEL PRODUCTO</div>

      <div className="items-factura mt-5">
        <div className="row mb-3">
          <div className="col-md-6">
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => handleChangeProducto(e)}
            >
              <option selected>Selecciona un producto</option>
              {productos.map((product) => (
                <option key={product.idProducto} value={product.idProducto}>
                  {product.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Código del producto"
              value={nuevoItem.codigoProducto}
              onChange={(e) =>
                setNuevoItem({ ...nuevoItem, codigoProducto: e.target.value })
              }
              readOnly
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Precio"
                value={nuevoItem.precio}
                onChange={(e) =>
                  setNuevoItem({ ...nuevoItem, precio: e.target.value })
                }
                readOnly
              />
              <span className="input-group-text">$</span>
            </div>
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Cantidad"
              value={nuevoItem.cantidad}
              onChange={(e) =>
                setNuevoItem({
                  ...nuevoItem,
                  cantidad: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6 d-flex justify-content-end">
            <button className="btn btn-success btn-sm" onClick={handleAddItem}>
              Agregar
            </button>
          </div>
        </div>
      </div>

      <table className="table mt-5 custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>IdFactura</th>
            <th>Código del producto</th>
            <th>Nombre del producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturaData.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.idFactura}</td>
              <td>{item.idProducto}</td>
              <td>{item.nombreProducto}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={item.precio}
                  onChange={(e) => handlePrecioChange(index, e.target.value)}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={item.cantidad}
                  onChange={(e) =>
                    handleCantidadChange(index, parseInt(e.target.value))
                  }
                />
              </td>
              <td>{item.subtotal.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteItem(index)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table mt-5 invoice-summary-table">
        <tbody>
          <tr>
            <td className="text-end">
              <strong>Subtotal:</strong>
            </td>
            <td className="text-end">{calcularSubtotal().toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-end">
              <strong>Porcentaje de IGV:</strong>
            </td>
            <td className="text-end">12%</td>
          </tr>
          <tr>
            <td className="text-end">
              <strong>IGV:</strong>
            </td>
            <td className="text-end">{calcularIGV().toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-end">
              <strong>Total:</strong>
            </td>
            <td className="text-end">{calcularTotal()}</td>
          </tr>
        </tbody>
      </table>

      <button
        className="btn btn-primary"
        onClick={handleSaveFactura}
        disabled={!camposCompletos}
      >
        Guardar Factura
      </button>
    </div>
  );
}

export default CrearFactura;
