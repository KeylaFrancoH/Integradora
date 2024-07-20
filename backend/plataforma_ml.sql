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
 
CREATE TABLE IF NOT EXISTS Contenido (
    idContenido INT AUTO_INCREMENT PRIMARY KEY,
    idCurso INT,
    Titulo VARCHAR(255) NOT NULL,
    Contenido_descripcion TEXT,
    FOREIGN KEY (idCurso) REFERENCES Curso(idCurso)
);
 
CREATE TABLE IF NOT EXISTS Tema (
    idTema INT AUTO_INCREMENT PRIMARY KEY,
    idContenido INT,
    Titulo VARCHAR(255) NOT NULL,
    Subtitulo VARCHAR(255),
    Material TEXT,
    Tipo VARCHAR(255),
    FOREIGN KEY (idContenido) REFERENCES Contenido(idContenido)
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
    idTema INT,
     FOREIGN KEY (idTema) REFERENCES Tema(idTema)
);
 
CREATE TABLE IF NOT EXISTS Grafico (
    idGrafico INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    Tipo_grafico VARCHAR(255),
    etiqueta BOOLEAN,
    FOREIGN KEY (idTema) REFERENCES Tema(idTema)
);
 
CREATE TABLE IF NOT EXISTS Archivo (
    idArchivo INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    Enlace VARCHAR(255),
    youtube VARCHAR(255),
    archivo VARCHAR(255),
    descripcion TEXT,
    idConfiguracion INT,
    FOREIGN KEY (idTema) REFERENCES Tema(idTema),
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
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