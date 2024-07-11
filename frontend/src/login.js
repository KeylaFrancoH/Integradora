import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8081/login", { usuario, contrasena });
            console.log(res);
            if (res.data.bloqueado) {
                setErrorMessage("Su cuenta está bloqueada. Por favor, comuníquese con el administrador.");
            } else {
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                setErrorMessage("Usuario o contraseña incorrectos");
            } else if(error.response && error.response.status === 402) {
                setErrorMessage("Su cuenta está bloqueada. Por favor, comuníquese con el administrador.");
            } else {
                setErrorMessage("Error en el servidor. Por favor, inténtelo de nuevo más tarde.");
            }
        }
    }

    if (isLoggedIn) {
        return <Navigate to="/Clientes" />;
    }

    return (
        <div className='d-flex vh-100'>
            <div className='bg-primary' style={{flex: '0 0 60%'}}>
                <img src="https://i.pinimg.com/564x/5d/38/55/5d38553a3e5686bced58eaac57be1d39.jpg" className="w-100 h-100" alt="Background" />
            </div>
            <div className='d-flex justify-content-center align-items-center bg-light' style={{flex: '1'}}>
                <div className='p-5 rounded shadow-lg col-lg-8'>
                    <h2 className="mb-4 text-center">Inicio de Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        {errorMessage && <div className="alert alert-danger mb-3" role="alert">{errorMessage}</div>}
                        <div className='mb-3'>
                            <label htmlFor='usuario' className="form-label">Usuario</label>
                            <input type='text' id='usuario' name='usuario' placeholder='Ingrese su Usuario' className='form-control form-control-lg' 
                            onChange={(e) => {setUsuario(e.target.value)}}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='contrasena' className="form-label">Contraseña</label>
                            <input type='password' id='contrasena' name='contrasena' placeholder='Ingrese su Contraseña' className='form-control form-control-lg' 
                            onChange={(e) => {setContrasena(e.target.value)}}
                            />
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-primary btn-lg" type='submit'>Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
