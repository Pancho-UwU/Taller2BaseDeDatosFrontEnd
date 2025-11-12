import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reporte() {
    const [reporteData, setReporteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tipoReporte, setTipoReporte] = useState("");
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("token");

    // 15. Cantidad de productos vendidos durante el año actual
    const obtenerProductosVendidosAnual = async () => {
        setLoading(true);
        setError("");
        setTipoReporte("cantidad");
        try {
            const res = await axios.get(
                "http://localhost:3000/api/cliente/productos-vendidos-anual",
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setReporteData(res.data.data);
        } catch (error) {
            setError("Error al obtener productos vendidos");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // 16. Top 10 productos más vendidos de categoría salado (2025)
    const obtenerTopSalados2025 = async () => {
        setLoading(true);
        setError("");
        setTipoReporte("top-salados");
        try {
            const res = await axios.get(
                "http://localhost:3000/api/reportes/top-salados-2025",
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setReporteData(res.data.data);
        } catch (error) {
            setError("Error al obtener top productos salados");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // 17. Top 10 productos menos vendidos de categoría dulce (2024)
    const obtenerMenosDulces2024 = async () => {
        setLoading(true);
        setError("");
        setTipoReporte("menos-dulces");
        try {
            const res = await axios.get(
                "http://localhost:3000/api/reportes/menos-dulces-2024",
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setReporteData(res.data.data);
        } catch (error) {
            setError("Error al obtener productos menos vendidos");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="crud-container">
            {/* Header */}
            <div className="crud-header">
                <h1 className="crud-title">Reportes de Ventas</h1>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button className="btn-clientes" onClick={() => navigate("/cliente")}>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Gestión de Clientes
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Botones de Reportes */}
            <div className="reportes-actions">
                <div className="reportes-grid">
                    <button 
                        className="btn-reporte" 
                        onClick={obtenerProductosVendidosAnual}
                        disabled={loading}
                    >
                        <div className="reporte-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="reporte-title">Productos Vendidos Año Actual</span>
                    </button>

                    <button 
                        className="btn-reporte" 
                        onClick={obtenerTopSalados2025}
                        disabled={loading}
                    >
                        <div className="reporte-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <span className="reporte-title"> Top 10 Productos Salados 2025</span>
                    </button>

                    <button 
                        className="btn-reporte" 
                        onClick={obtenerMenosDulces2024}
                        disabled={loading}
                    >
                        <div className="reporte-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <span className="reporte-title">10 Productos Dulces Menos Vendidos 2024</span>
                    </button>
                </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="error-banner">
                <span>{error}</span>
                </div>
            )}

            {/* Resultados */}
            <div className="reportes-resultados">
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando reporte...</p>
                    </div>
                )}

                {reporteData && !loading && (
                    <div className="resultado-container">
                        <h2 className="resultado-titulo">
                            {tipoReporte === "cantidad" && "Productos Vendidos - Año Actual"}
                            {tipoReporte === "top-salados" && "Top 10 Productos Salados - 2025"}
                            {tipoReporte === "menos-dulces" && "10 Productos Dulces Menos Vendidos - 2024"}
                        </h2>

                        {/* Reporte 15 - Solo muestra un número */}
                        {tipoReporte === "cantidad" && (
                            <div className="dato-general">
                                <div className="dato-numero">{reporteData}</div>
                                <div className="dato-label">Productos Vendidos</div>
                            </div>
                        )}

                        {/* Reportes 16 y 17 - Tablas */}
                        {(tipoReporte === "top-salados" || tipoReporte === "menos-dulces") && (
                            <div className="table-container">
                                <table className="crud-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Cantidad Vendida</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reporteData.map((producto, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{producto.nombre || producto.producto}</td>
                                                <td>{producto.categoria}</td>
                                                <td>{producto.cantidad_vendida || producto.total_vendido}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}