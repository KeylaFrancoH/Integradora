
CREATE SCHEMA facturacion;
USE facturacion;

-- Creación de la tabla de usuarios
CREATE TABLE Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    intentosFallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE
);

-- Creación de la tabla de clientes
CREATE TABLE Clientes (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    RucDni VARCHAR(15),
    Nombre VARCHAR(100),
    Direccion VARCHAR(255),
    Correo VARCHAR(100),
    Activo BOOLEAN DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de productos
CREATE TABLE Productos (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    Codigo VARCHAR(15) UNIQUE,
    Nombre VARCHAR(100),
    Precio DECIMAL(10,2),
    Stock INT,
    Activo BOOLEAN DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla de facturas
CREATE TABLE Facturas (
    idFactura INT AUTO_INCREMENT PRIMARY KEY,
    NumeroFactura INT UNIQUE,
    idCliente INT,
    Subtotal DECIMAL(10,2),
    PorcentajeIGV DECIMAL(5,2),
    IGV DECIMAL(10,2),
    Total DECIMAL(10,2),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente)
);

-- Creación de la tabla de detalles de facturas
CREATE TABLE DetallesFacturas (
    idItem INT AUTO_INCREMENT PRIMARY KEY,
    idFactura INT,
    idProducto INT,
    Cantidad INT DEFAULT 1,
    Subtotal DECIMAL(10,2),
    FOREIGN KEY (idFactura) REFERENCES Facturas(idFactura),
    FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
);

INSERT INTO Usuarios (usuario, contrasena) VALUES ('admin1', '12345678');
insert INTO Usuarios (usuario, contrasena) VALUES ("Keyla", "12345678");
SELECT * FROM Usuarios;

INSERT INTO Clientes (RucDni, Nombre, Direccion, Correo)
VALUES ('0915874224', 'Karina Alejandra Andrade Herrera', 'Urdesa Central', 'cliente@example.com');
INSERT INTO Clientes (RucDni, Nombre, Direccion, Correo, Activo)
VALUES ('0984578896', 'Walter Gustavo Castillo Ponce ', 'Alborada 5ta Etapa', 'clientePrueba@example.com',1),
('1100658782', 'Luis Rafael Pazmiño Cuello', 'Garzota', 'luisPC@example.com', 0);
SELECT * FROM Clientes;

INSERT INTO Productos (Codigo, Nombre, Precio, Stock)
VALUES ('DBZ001', 'Cuadernos 100hjs', 3.77, 100),
       ('SM001', 'Cubo Rubik', 11.92, 62),
       ('DBZF001', 'UNO CARDS', 7.35, 100),
       ('DBZ002', 'Figura Dragon Ball Z Banpresto', 12.87, 50),
       ('B001', 'Batmobile Exclusive', 46.59, 10),
       ('1R2001', 'Monopoly', 20.49, 10);
SELECT * FROM Productos;

  

drop database facturacion;