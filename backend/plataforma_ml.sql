drop schema Plataforma_ML;
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

CREATE TABLE IF NOT EXISTS Configuracion (
    idConfiguracion INT AUTO_INCREMENT PRIMARY KEY,
    idTema INT,
    Titulo VARCHAR(255),
    Enunciado TEXT,
    idFormula INT,
    idGrafico INT, 
    habilitado BOOLEAN,
    intentos INT, 
    instrucciones TEXT,
    FOREIGN KEY (idTema) REFERENCES Tema(idTema),
    FOREIGN KEY (idFormula) REFERENCES Formula(idFormula),
    FOREIGN KEY (idGrafico) REFERENCES Grafico(idGrafico)
);
 
 CREATE TABLE IF NOT EXISTS Parametro (
    idParametro INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    formula TEXT,
    parametro_regularización VARCHAR(255),
    intercepto boolean, 
    metodo_inicialización varchar(255),
    numero_clusters int,
    numero_iteraciones int,
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);

CREATE TABLE IF NOT EXISTS Variable (
    idVariable INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    
    variable varchar(255),
   
    
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);

CREATE TABLE IF NOT EXISTS Puntos (
    idPuntos INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    
    punto_X DOUBLE,
    punto_Y DOUBLE, 
    
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);


 CREATE TABLE IF NOT EXISTS ContenidoEjercicios (
    idContenidoEjercicios INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    
    k_min int,
    k_max int,
    k_exacto int,
    
    iteracion_min int, 
    iteracion_max int,
    iteracion_exacto int,
    
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion)
);

CREATE TABLE IF NOT EXISTS ArchivoEjercicios (
    idArchivoEjercicio INT AUTO_INCREMENT PRIMARY KEY,
    idConfiguracion INT,
    idTema INT,
    rutaArchivo VARCHAR(255),
    descripcion TEXT,  
    FOREIGN KEY (idConfiguracion) REFERENCES Configuracion(idConfiguracion),
    FOREIGN KEY (idTema) REFERENCES Tema(idTema)
);

INSERT INTO Usuario (Nombre, Apellido, Correo, Contrasena, idAdmin)
VALUES ('Keyla', 'Franco', 'juan.perez@example.com', 'password123', 1);

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

INSERT INTO tema (idTema, idCurso, Titulo, Subtitulo, Material)
VALUES (1, 1, 'Regrésion Lineal', '', 'La regresión lineal es un método estadístico fundamental para analizar la relación entre una variable dependiente y una o más variables independientes. Su objetivo principal es ajustar una línea recta a los datos de manera que minimice la diferencia entre los valores observados y los valores predichos por el modelo. Esta línea se define por dos parámetros clave: la pendiente y la intersección. La pendiente representa el cambio en la variable dependiente por cada unidad de cambio en la variable independiente, mientras que la intersección es el valor de la variable dependiente cuando la variable independiente es cero.
En la práctica de la regresión lineal, encontrar los valores óptimos para estos parámetros es crucial para obtener un modelo preciso. Para lograr esto, se emplea el descenso del gradiente, una técnica de optimización que ajusta iterativamente los parámetros del modelo para minimizar una función de coste. Este proceso busca la mejor combinación de parámetros que reduzca el error entre las predicciones del modelo y los datos reales. La función de coste mide cuán lejos están las predicciones del modelo de los valores reales, y el descenso del gradiente ajusta los parámetros para reducir este error.
En el ámbito del Machine Learning, los hiperparámetros juegan un papel importante en la configuración del modelo. Estos son parámetros que se establecen antes del entrenamiento y que afectan el rendimiento del modelo. Elegir incorrectamente los hiperparámetros puede resultar en un modelo que no generaliza bien a nuevos datos, lo que puede llevar al subajuste, donde el modelo no captura adecuadamente la relación en los datos de entrenamiento. El ajuste adecuado de estos hiperparámetros, junto con el uso efectivo del descenso del gradiente, es crucial para lograr un modelo de regresión lineal que sea tanto preciso como generalizable.
');



INSERT INTO enlaces (idTema, Enlace)
VALUES (1, 'https://www.youtube.com/watch?v=sRuzK3-8Rms');

INSERT INTO enlaces (idTema, Enlace)
VALUES (1, 'https://forms.gle/NHDXsivzkPGprvkJ6');

INSERT INTO enlaces (idTema, Enlace)
VALUES (1, 'https://forms.gle/R3FGr3fcSw4VJxnMA');


INSERT INTO configuracion (idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones)
VALUES (1, 'Gráfica de Regresión', '', 3, 1, 1, 1, 'Modifique los valores de la gráfica para encontrar la solución a las preguntas de la encuesta. No olvidar llenar el formulario de Post evaluación y satisfacción.');


INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 100, 180);

INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 150, 220);

INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 200, 280);

INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 250, 320);

INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 300, 370);

INSERT INTO puntos (idConfiguracion, punto_X, punto_Y)
VALUES (1, 350, 410);


INSERT INTO parametro (idParametro, idConfiguracion, formula, parametro_regularización, intercepto, metodo_inicialización, numero_clusters, numero_iteraciones)
VALUES (1, 1, 'J(\beta_0, \beta_1) = \frac{1}{2m} \sum_{i=1}^m \left( y_i - (\beta_0 + \beta_1 x_i) \right)^2', '', 1, '', 0, 0);

INSERT INTO tema (idTema, idCurso, Titulo, Subtitulo, Material)
VALUES (2, 2, 'K-Means', '', 'El algoritmo K-means es una técnica de aprendizaje no supervisado utilizada para la agrupación de datos. Su objetivo principal es particionar un conjunto de datos en un número definido de clústeres, donde cada clúster contiene datos que son más similares entre sí que con los datos de otros clústeres. Para lograr esto, el algoritmo asigna cada punto de datos al clúster cuyo centroide (el promedio de los puntos en el clúster) es el más cercano, y luego recalcula los centroides de los clústeres en función de las nuevas asignaciones. El proceso se repite iterativamente hasta que los centroides se estabilizan y el algoritmo converge. Una de las principales limitaciones del algoritmo K-means es que requiere que el número de clústeres se especifique de antemano. Esta necesidad de definir el número de clústeres, conocido como "k", puede ser problemática ya que una elección incorrecta puede llevar a una segmentación inadecuada de los datos. Si el número de clústeres es muy pequeño, los datos pueden estar agrupados de manera demasiado general, mientras que un número demasiado grande puede resultar en clústeres con poca cohesión. Esto afecta negativamente la calidad de la segmentación y la interpretación de los resultados. El método del codo (Elbow Method) es una técnica comúnmente utilizada para determinar el número óptimo de clústeres en el algoritmo K-means. En esta técnica, se ejecuta el algoritmo K-means para diferentes valores de k y se calcula la suma de los errores cuadráticos dentro del clúster (SSE) para cada valor de k. El objetivo es identificar el punto en el que la reducción en SSE comienza a desacelerarse, lo que indica el número adecuado de clústeres. Este punto de inflexión, o "codo", proporciona una estimación del valor óptimo de k para el modelo.');





INSERT INTO enlaces (idTema, Enlace)
VALUES (2, 'https://www.youtube.com/watch?v=2BICD8fzlDs');


INSERT INTO configuracion (idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones)
VALUES (2, 'Gráficas de K-Means', '', 6, 5, 1, 1, 'Modifique los valores de la gráfica para encontrar la solución a las preguntas de la encuesta. No olvidar llenar el formulario de Post evaluación y satisfacción.');

INSERT INTO archivoejercicios (idConfiguracion, idTema, rutaArchivo, descripcion)
VALUES (2, 2, 'http://localhost:3000/ArchivosEjercicios/crime.csv', '');

INSERT INTO enlaces (idTema, Enlace)
VALUES (2, 'https://forms.gle/R3FGr3fcSw4VJxnMA');

INSERT INTO enlaces (idTema, Enlace)
VALUES (2, 'https://forms.gle/NHDXsivzkPGprvkJ6');
INSERT INTO parametro (idConfiguracion, formula, parametro_regularización, intercepto, metodo_inicialización, numero_clusters, numero_iteraciones)
VALUES (2, 'J = \sum_{i=1}^k \sum_{x \in C_i} \| x - \mu_i \|^2', '', 1, 0, 0, 0);







