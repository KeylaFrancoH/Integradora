# InteractiveML Prototipo Funcional

## Features :

(Node.js / Express.js / MySQL / React.js ) 👨‍💻

## Getting started

# Instructivo de instalación

## Clonar el repositorio

Clonar el repositorio [https://github.com/Rjzaruma/Integradora.git](https://github.com/Rjzaruma/Integradora.git).

## Configuración de MySQL

1. Ir a **MySQL Workbench** y correr el script para cargar la base de datos y los registros de prueba: `plataforma_ml.sql`.

## Instalar dependencias y configuración de entorno

1. Ir a la carpeta **frontend**.
2. Abrir un **CMD** y correr los siguientes comandos:

    ```bash
    npm i papaparse --legacy-peer-deps
    npm i react-modal --legacy-peer-deps
    ```

3. Ir a la carpeta **backend**.
4. Entrar a la carpeta **config**.
5. Abrir el archivo `config.json` y cambiar `username` y `password` a las credenciales de MySQL. Dejar los demás valores por defecto.

## Correr la plataforma

1. Abrir un **CMD** en la carpeta **backend** y ejecutar el comando:

    ```bash
    npm run server
    ```

2. Abrir un **CMD** en la carpeta **frontend** y ejecutar el comando:

    ```bash
    npm start
    ```

