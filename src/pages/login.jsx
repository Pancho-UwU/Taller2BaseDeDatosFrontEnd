import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login(){
    const [nombre_usuario, setNombre_usuario] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate  = useNavigate();
    
    const handleLogin = async (e) =>{
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:3000/api/usuario/login",{
                nombre_usuario, 
                contrasenia
            })
            localStorage.setItem("token", res.data.token);
            navigate("/cliente");
        }catch(error){
            setError("Credenciales incorrectas");
        }
    };
    return (
        <div className="login-wrapper">
        <div className="login-container">
            <div className="login-header">
            <h2 className="login-title">Bienvenido</h2>
            <p className="login-subtitle">Inicia sesión en Pasteleria Emili</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
                <label htmlFor="nombre_usuario" className="input-label">
                Usuario
                </label>
                <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                    id="nombre_usuario"
                    className="login-input"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={nombre_usuario}
                    onChange={(e) => setNombre_usuario(e.target.value)}
                    required
                    autoComplete="username"
                />
                </div>
            </div>

            <div className="input-group">
                <label htmlFor="contrasenia" className="input-label">
                Contraseña
                </label>
                <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                    id="contrasenia"
                    className="login-input"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                </div>
            </div>

            {error && (
                <div className="error-message">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
                </div>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
                {loading ? (
                <span className="loader"></span>
                ) : (
                "Iniciar Sesión"
                )}
            </button>
            </form>
        </div>
        </div>
    );
};