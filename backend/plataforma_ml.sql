#drop schema Plataforma_ML;
CREATE SCHEMA IF NOT EXISTS Plataforma_ML;
USE Plataforma_ML;


CREATE TABLE IF NOT EXISTS Usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Apellido VARCHAR(255) NOT NULL,
    Correo VARCHAR(255) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    idAdmin BOOLEAN
);
 
CREATE TABLE IF NOT EXISTS Curso (
    idCurso INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    Descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Tema ( -- Tema se refiere a la creacion de subtemas dentro de curso, en el cual al ser parte del av, en realidad serian nuestros temas
    idTema INT AUTO_INCREMENT PRIMARY KEY,
    idCurso INT,
    Titulo VARCHAR(255) NOT NULL,
    Subtitulo VARCHAR(255),
    Material TEXT,
    FOREIGN KEY (idCurso) REFERENCES Curso(idCurso)
);
 
 
CREATE TABLE IF NOT EXISTS Configuracion (
    idConfiguracion INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    Parametros VARCHAR(255),
    Titulo VARCHAR(255),
    Enumerado TEXT,
    intentos INT, 
    FOREIGN KEY (idTema) REFERENCES Tema(idTema)
);
 
CREATE TABLE IF NOT EXISTS Formula (
    idFormula INT AUTO_INCREMENT PRIMARY KEY,
    nombreFormula VARCHAR(255),
    formula  VARCHAR(255),
    idCurso INT,
     FOREIGN KEY (idCurso) REFERENCES Curso(idCurso)
);
 
CREATE TABLE IF NOT EXISTS Grafico (
    idGrafico INT AUTO_INCREMENT PRIMARY KEY,
    idCurso INT,
    Tipo_grafico VARCHAR(255),
    etiqueta BOOLEAN,
     FOREIGN KEY (idCurso) REFERENCES Curso(idCurso)
);
 
CREATE TABLE IF NOT EXISTS Archivo (
    idArchivo INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    archivo VARCHAR(255),
    descripcion TEXT,
   -- idConfiguracion INT,
    FOREIGN KEY (idTema) REFERENCES Tema(idTema)
    -- FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);

 CREATE TABLE IF NOT EXISTS Enlaces (
    idEnlace INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    Enlace TEXT,
    FOREIGN KEY (idTema) REFERENCES Tema(idTema)
);


CREATE TABLE IF NOT EXISTS Instruccion (
    idInstrucciones INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    Instrucciones TEXT,
    idCurso INT,
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion),
    FOREIGN KEY (idCurso) REFERENCES Curso(idCurso)
);
 
CREATE TABLE IF NOT EXISTS Parametro (
    idParametro INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    parametro VARCHAR(255),
    valor_parametro VARCHAR(255),
    valores_maximo VARCHAR(255),
    tipo_seleccion VARCHAR(255),
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);
 
CREATE TABLE IF NOT EXISTS ConfiguracionEjercicio (
    idEjercicio INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    habilitado BOOLEAN,
    variables_ejercicio VARCHAR(255),
    campo_ejercicios VARCHAR(255),
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);
 
CREATE TABLE IF NOT EXISTS Seleccion (
    idSeleccion INT AUTO_INCREMENT PRIMARY KEY,
    idParametro INT,
    nombre_metodo VARCHAR(255),
    FOREIGN KEY (idParametro) REFERENCES Parametro(idParametro)
);
CREATE TABLE IF NOT EXISTS ContenidoEjercicio (
    idContenido INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    idEjercicio INT,
    nombre_variable VARCHAR(255),
    nuevo_valor VARCHAR(255),
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion),
    FOREIGN KEY (idEjercicio) REFERENCES ConfiguracionEjercicio(idEjercicio)
);
 
CREATE TABLE IF NOT EXISTS Variable (
    idVariable INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    idEjercicio INT,
    nombre_variable VARCHAR(255),
    valor_variable VARCHAR(255),
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion),
    FOREIGN KEY (idEjercicio) REFERENCES ConfiguracionEjercicio(idEjercicio)
);


INSERT INTO Curso (idCurso, Titulo, Descripcion) VALUES
(1, 'Aprendizaje Supervisado', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
(2, 'Aprendizaje No Supervisado', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');

INSERT INTO Formula (idFormula, nombreFormula, formula, idCurso) VALUES
(1, 'Regresión Lineal Simple', 'y = \\beta_0 + \\beta_1 x + \\epsilon', 1),
(2, 'Regresión Lineal Múltiple', 'y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\cdots + \\beta_p x_p + \\epsilon', 1),
(3, 'Función de Costo (Error Cuadrático Medio) MSE', 'J(\\beta_0, \\beta_1) = \\frac{1}{2m} \\sum_{i=1}^m \\left( y_i - (\\beta_0 + \\beta_1 x_i) \\right)^2', 1),
(4, 'Gradiente Descendente', '\\beta_j := \\beta_j - \\alpha \\frac{\\partial J(\\beta_0, \\beta_1)}{\\partial \\beta_j}', 1),
(5, 'Estimación de Coeficientes', '\\boldsymbol{\\beta} = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}', 1),
(6, 'Objetivo de K-Means', 'J = \\sum_{i=1}^k \\sum_{x \\in C_i} \\| x - \\mu_i \\|^2', 2),
(7, 'Actualización de Centros de Clústeres', '\\mu_i = \\frac{1}{|C_i|} \\sum_{x \\in C_i} x', 2),
(8, 'Asignación de Clústeres', '\\text{Asignar } x \\text{ al clúster } i \\text{ tal que } i = \\arg \\min_j \\| x - \\mu_j \\|^2', 2),
(9, 'Distancia de Enlace Simple', 'd(C_i, C_j) = \\min_{x \\in C_i, y \\in C_j} \\| x - y \\|', 2),
(10, 'Distancia de Enlace Completo', 'd(C_i, C_j) = \\max_{x \\in C_i, y \\in C_j} \\| x - y \\|', 2),
(11, 'Distancia de Enlace Medio', 'd(C_i, C_j) = \\frac{1}{|C_i| \\cdot |C_j|} \\sum_{x \\in C_i} \\sum_{y \\in C_j} \\| x - y \\|', 2);

INSERT INTO Grafico (idGrafico, idCurso, Tipo_grafico, etiqueta) VALUES
(1, 1, 'Dispersion', true),
(2, 1, 'Dispersión con Línea de Regresión', true),
(3, 1, 'Gráfico de Residuales', true),
(4, 1, 'Gráfico de Ajuste vs. Realidad', true),
(5, 2, 'Gráfico de Clústeres', true),
(6, 2, 'Gráfico de Codo', true),
(7, 2, 'Dendrograma', true),
(8, 2, 'Matriz de Distancias (Heatmap)', true),
(9, 2, 'Gráfico de Validación Cruzada ', true),
(10, 2, 'Gráfico de Búsqueda de Cuadrícula (Grid Search) ', true),
(11, 1, 'Gráfico de Ajuste de Línea ', true);

select * from enlaces;


select * from archivo;




