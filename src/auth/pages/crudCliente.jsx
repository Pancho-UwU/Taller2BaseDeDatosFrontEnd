import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/CrudCliente.css";

export default function CrudClient() {

    const [clientes, setClientes] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState("todos");
    const [showModal, setShowModal] = useState(false);
    const [showModalPedidos, setShowModalPedidos] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [pedidos, setPedidos] = useState([]);
    const [clienteActual, setClienteActual] = useState({
        id_cliente: null,
        nombre: "",
        edad: "",
        email: "",
        tipo: "Normal",
        estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Obtener token
    const getToken = () => localStorage.getItem("token");

    // Cargar clientes al montar el componente
    useEffect(() => {
        obtenerClientes();
    }, []);



    // Obtener todos los clientes
    const obtenerClientes = async (filtro ="todos") => {
        setLoading(true);
        setFiltroActivo(filtro);
        try {
            let url;
            if(filtro ==="todos"){
                url ="http://localhost:3000/api/cliente";
            }else if( filtro === "Normal"){
                url ="http://localhost:3000/api/cliente/normal";
            }
            else if( filtro === "Premium"){
                url ="http://localhost:3000/api/cliente/premium";
            }
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setClientes(res.data.data);
            setError("");
        } 
        catch (error) {
            setError("Error al obtener clientes");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };



    // Abrir modal para crear
    const abrirModalCrear = () => {
        setClienteActual({
        id_cliente: null,
        nombre: "",
        edad: "",
        email: "",
        tipo: "Normal",
        estado: 1
        });
        setShowModal(true);
        setError("");
    };

   
    // Iniciar venta
    const iniciarVenta = (id_cliente) => {
    localStorage.setItem("id_cliente_venta", id_cliente);
    navigate("/crear-venta");
    };

    // Guardar cliente (crear o actualizar)
    const crearCliente = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
            "http://localhost:3000/api/clientes",
            clienteActual,
            { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setShowModal(false);
            obtenerClientes(filtroActivo);
            setError("");
        } catch (error) {
            setError("Error al crear cliente");
        } finally {
            setLoading(false);
        }
    };
    const actualizarTipo = async (id) => {
        setLoading(true);
        try {
            await axios.patch(
            `http://localhost:3000/api/clientes/${id}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            obtenerClientes(filtroActivo);
            setError("");
        } catch (error) {
            setError("Error al actualizar tipo");
        } finally {
            setLoading(false);
        }
    };

    // Eliminar cliente
    const eliminarCliente = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

        setLoading(true);
        try {
        await axios.delete(`http://localhost:3000/api/clientes/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        obtenerClientes(filtroActivo);
        setError("");
        } catch (error) {
        setError("Error al eliminar cliente");
        } finally {
        setLoading(false);
        }
    };

    const abrirModalPedidos = (cliente) => {
        setClienteSeleccionado(cliente);
        setFechaConsulta("");
        setPedidos([]);
        setShowModalPedidos(true);
        setError("");
    };

    const consultarPedidos = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:3000/api/cliente/detalleVenta',
                data: {
                    idCliente: clienteSeleccionado.id_cliente,
                    fecha: fechaConsulta
                },
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            setPedidos(res.data.data || []);
            setError("");
        } catch (error) {
            setError("Error al consultar pedidos: " + (error.response?.data?.message || error.message));
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="crud-container">
        {/* Header */}
        <div className="crud-header">
            <h1 className="crud-title">Gestión de Clientes</h1>
            <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
            </button>
        </div>

        {/* Barra de acciones */}
        <div className="crud-actions">
            <div className="filter-buttons">
            <button
                className={`btn-filter ${filtroActivo === "todos" ? "active" : ""}`}
                onClick={() => obtenerClientes("todos")}
            >
                Todos
            </button>
            <button
                className={`btn-filter ${filtroActivo === "Normal" ? "active" : ""}`}
                onClick={() => obtenerClientes("Normal")}
            >
                Normal
            </button>
            <button
                className={`btn-filter ${filtroActivo === "Premium" ? "active" : ""}`}
                onClick={() => obtenerClientes("Premium")}
            >
                Premium
            </button>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-reportes" onClick={() => navigate("/reportes")}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Ver Reportes
                </button>
                <button className="btn-productos" onClick={() => navigate("/productos")}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Ver Productos
                </button>
                
                
                <button className="btn-crear" onClick={abrirModalCrear}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Cliente
                </button>
                
            </div>
        </div>

        {/* Mensaje de error */}
        {error && (
            <div className="error-banner">
            <span>{error}</span>
            </div>
        )}

        {/* Tabla de clientes */}
        <div className="table-container">
            {loading && clientes.length === 0 ? (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando clientes...</p>
            </div>
            ) : clientes.length === 0 ? (
            <div className="empty-state">
                <p>No hay clientes para mostrar</p>
            </div>
            ) : (
            <table className="crud-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map((cliente) => (
                    <tr key={cliente.id_cliente}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.edad}</td>
                    <td>{cliente.email}</td>
                    <td>
                        <span className={`badge badge-${cliente.tipo.toLowerCase()}`}>
                        {cliente.tipo}
                        </span>
                    </td>
                    <td>
                        <button
                        className={`btn-estado ${cliente.estado === 1 ? "activo" : "inactivo"}`}
                        onClick={() => cambiarEstado(cliente.id_cliente, cliente.estado)}
                        >
                        {cliente.estado === 1 ? "Activo" : "Inactivo"}
                        </button>
                    </td>
                    <td>
                        <div className="action-buttons">
                        <button
                            className="btn-action btn-venta"
                            onClick={() => iniciarVenta(cliente.id_cliente)}
                            title="Generar Venta"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        </button>


                        <button
                            className="btn-action btn-tipo"
                            onClick={() => actualizarTipo(cliente.id_cliente)}
                            title="Cambiar Tipo"
                            >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </button>
                        <button
                            className="btn-action btn-pedidos"
                            onClick={() => abrirModalPedidos(cliente)}
                            title="Ver Pedidos"
                            >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                        <button
                            className="btn-action btn-delete"
                            onClick={() => eliminarCliente(cliente.id_cliente)}
                            title="Eliminar"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>

        {/* Modal */}
        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                <h2>Nuevo Cliente</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>

                <form onSubmit={crearCliente} className="modal-form">
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                    type="text"
                    value={clienteActual.nombre}
                    onChange={(e) => setClienteActual({...clienteActual, nombre: e.target.value})}
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Edad</label>
                    <input
                    type="number"
                    value={clienteActual.edad}
                    onChange={(e) => setClienteActual({...clienteActual, edad: e.target.value})}
                    required
                    min="1"
                    max="120"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                    type="email"
                    value={clienteActual.email}
                    onChange={(e) => setClienteActual({...clienteActual, email: e.target.value})}
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Tipo</label>
                    <select
                    value={clienteActual.tipo}
                    onChange={(e) => setClienteActual({...clienteActual, tipo: e.target.value})}
                    required
                    >
                    <option value="Normal">Normal</option>
                    <option value="Premium">Premium</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <span className="loader-small"></span> :  "Crear"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        {/* Modal Consultar Pedidos */}
        {showModalPedidos && (
        <div className="modal-overlay" onClick={() => setShowModalPedidos(false)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Detalles de Ventas - {clienteSeleccionado?.nombre}</h2>
                <button className="modal-close" onClick={() => setShowModalPedidos(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <form onSubmit={consultarPedidos} className="modal-form">
                <div className="form-group">
                <label>Seleccione una fecha</label>
                <input
                    type="date"
                    value={fechaConsulta}
                    onChange={(e) => setFechaConsulta(e.target.value)}
                    required
                />
                </div>

                <button type="submit" className="btn-save" disabled={loading}>
                {loading ? <span className="loader-small"></span> : "Consultar Ventas"}
                </button>
            </form>

            {pedidos.length > 0 && (
                <div className="pedidos-resultado">
                <h3>Resultados ({pedidos.length} productos vendidos)</h3>
                <table className="tabla-pedidos">
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>ID Boleta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedidos.map((pedido, index) => (
                        <tr key={index}>
                        <td>{pedido.nombre_producto}</td>
                        <td>${pedido.precio?.toLocaleString()}</td>
                        <td>{pedido.cantidad_producto}</td>
                        <td>{pedido.Boletaid_boleta}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {pedidos.length === 0 && fechaConsulta && !loading && (
                <div className="empty-state">
                <p>No se encontraron ventas para esta fecha</p>
                </div>
            )}
            </div>
        </div>
        )}
        </div>
        
    );
    
}