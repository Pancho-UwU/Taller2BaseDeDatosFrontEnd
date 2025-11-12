import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/crudProductos.css";

export default function CrudProductos() {
    const [productos, setProductos] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState("todos");
    const [showModalPrecio, setShowModalPrecio] = useState(false);
    const [showModalStock, setShowModalStock] = useState(false);
    const [nuevoPrecio, setNuevoPrecio] = useState(0);
    const [nuevoStock, setNuevoStock] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [showModalCrear, setShowModalCrear] = useState(false);
    const [productoNuevo, setProductoNuevo] = useState({
    nombre: "",
    precio: 0,
    stock: 0,
    tipo: "Dulce",
    estado: 1,
    porciones: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async (filtro = "todos") => {
        setLoading(true);
        setFiltroActivo(filtro);
        try {
            let url;
            let response;
            
            if (filtro === "todos") {
            url = "http://localhost:3000/api/producto/all";
            response = await axios.get(url, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            } else if (filtro === "disponibles") {
            url = "http://localhost:3000/api/producto/disponibles";
            response = await axios.get(url, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            } else if (filtro === "vendidos") {
            // Calcular fecha de hace una semana
            const fechaActual = new Date();
            const fechaSemanaAtras = new Date(fechaActual);
            fechaSemanaAtras.setDate(fechaActual.getDate() - 7);
            
            
            // Formatear fecha como YYYY-MM-DD
            const fecha = fechaSemanaAtras.toISOString().split('T')[0];
            console.log(fecha)
            url = "http://localhost:3000/api/producto/vendidos-semana";
            response = await axios.post(url, 
                { fecha: fecha },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            }
            
            setProductos(response.data.data);
            setError("");
        } catch (error) {
            setError("Error al obtener productos");
            if (error.response?.status === 401) {
            navigate("/login");
            }
        } finally {
            setLoading(false);
        }
        };

    const abrirModalCrear = () => {
        setProductoNuevo({
            nombre: "",
            precio: 0,
            stock: 0,
            tipo: "Dulce",
            estado: 1,
            porciones: 0
        });
        setShowModalCrear(true);
        setError("");
    };

    const cambiarEstado = async (id) => {
        setLoading(true);
        try {
        await axios.patch(
            `http://localhost:3000/api/producto/delete/${id}`,
            {},
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        obtenerProductos();
        setError("");
        } catch (error) {
        setError("Error al cambiar estado");
        } finally {
        setLoading(false);
        }
    };

    const volverAClientes = () => {
        navigate("/cliente");
    };
    const abrirModalPrecio = (producto) => {
        setProductoSeleccionado(producto);
        setNuevoPrecio(producto.precio);
        setShowModalPrecio(true);
        setError("");
    };

    const abrirModalStock = (producto) => {
        setProductoSeleccionado(producto);
        setNuevoStock(0);
        setShowModalStock(true);
        setError("");
    };

    const actualizarPrecio = async (e) => {
        e.preventDefault();
        
        if (nuevoPrecio <= productoSeleccionado.precio) {
            setError("El nuevo precio debe ser mayor al actual");
            return;
        }

        setLoading(true);
        try {
            await axios.patch(
            `http://localhost:3000/api/producto/updatePrice/${productoSeleccionado.id_producto}`,
            { precio: nuevoPrecio },
            { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setShowModalPrecio(false);
            obtenerProductos();
            setError("");
        } catch (error) {
            setError("Error al actualizar precio");
        } finally {
            setLoading(false);
        }
    };

    const actualizarStock = async (e) => {
        e.preventDefault();
        
        if (nuevoStock <= 0) {
            setError("El stock a incrementar debe ser mayor a 0");
            return;
        }

        setLoading(true);
        try {
            await axios.patch(
            `http://localhost:3000/api/producto/actualizarStock/${productoSeleccionado.id_producto}`,
            { stock: nuevoStock },
            { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setShowModalStock(false);
            obtenerProductos();
            setError("");
        } catch (error) {
            setError("Error al actualizar stock");
        } finally {
            setLoading(false);
        }
    };
    const crearProducto = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
            "http://localhost:3000/api/producto/register",
            productoNuevo,
            { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setShowModalCrear(false);
            obtenerProductos(filtroActivo);
            setError("");
        } catch (error) {
            setError("Error al crear producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crud-container">
        <div className="crud-header">
            <h1 className="crud-title">Gestión de Productos</h1>
            <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={volverAClientes} className="btn-volver">
                Volver a Clientes
            </button>
            </div>
        </div>

        <div className="crud-actions">
            <div></div>
            <div className="crud-actions">
                <div className="filter-buttons">
                    <button
                    className={`btn-filter ${filtroActivo === "todos" ? "active" : ""}`}
                    onClick={() => obtenerProductos("todos")}
                    >
                    Todos
                    </button>
                    <button
                    className={`btn-filter ${filtroActivo === "disponibles" ? "active" : ""}`}
                    onClick={() => obtenerProductos("disponibles")}
                    >
                    Disponibles
                    </button>
                    <button
                    className={`btn-filter ${filtroActivo === "vendidos" ? "active" : ""}`}
                    onClick={() => obtenerProductos("vendidos")}
                    >
                    Vendidos (Semana)
                    </button>
                </div>

                <button className="btn-crear" onClick={abrirModalCrear}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Producto
                </button>
            </div>
        </div>

        {error && (
            <div className="error-banner">
            <span>{error}</span>
            </div>
        )}

        <div className="table-container">
            {loading && productos.length === 0 ? (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
            </div>
            ) : productos.length === 0 ? (
            <div className="empty-state">
                <p>No hay productos para mostrar</p>
            </div>
            ) : (
            <table className="crud-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Tipo</th>
                    <th>Porciones</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {productos.map((producto) => (
                    <tr key={producto.id_producto}>
                    <td>{producto.nombre_producto}</td>
                    <td>${producto.precio.toLocaleString()}</td>
                    <td>{producto.stock}</td>
                    <td>
                        <span className={`badge badge-${producto.tipo.toLowerCase()}`}>
                        {producto.tipo}
                        </span>
                    </td>
                    <td>{producto.porciones}</td>
                    <td>
                        <button
                        className={`btn-estado ${producto.estado === 1 ? "activo" : "inactivo"}`}
                        onClick={() => cambiarEstado(producto.id_producto)}
                        >
                        {producto.estado === 1 ? "Activo" : "Inactivo"}
                        </button>
                    </td>
                    <td>
                        <div className="action-buttons">
                            <button
                            className="btn-action btn-precio"
                            onClick={() => abrirModalPrecio(producto)}
                            title="Actualizar Precio"
                            >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </button>
                            <button
                            className="btn-action btn-stock"
                            onClick={() => abrirModalStock(producto)}
                            title="Incrementar Stock"
                            >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            </button>
                            <button
                            className="btn-action btn-delete"
                            onClick={() => cambiarEstado(producto.id_producto)}
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

        {/* Modal Actualizar Precio */}
        {showModalPrecio && (
        <div className="modal-overlay" onClick={() => setShowModalPrecio(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Actualizar Precio</h2>
                <button className="modal-close" onClick={() => setShowModalPrecio(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <form onSubmit={actualizarPrecio} className="modal-form">
                <div className="form-group">
                <label>Producto</label>
                <input
                    type="text"
                    value={productoSeleccionado?.nombre_producto}
                    disabled
                    style={{ background: "#f7fafc", color: "#718096" }}
                />
                </div>

                <div className="form-group">
                <label>Precio Actual</label>
                <input
                    type="text"
                    value={`$${productoSeleccionado?.precio.toLocaleString()}`}
                    disabled
                    style={{ background: "#f7fafc", color: "#718096" }}
                />
                </div>

                <div className="form-group">
                <label>Nuevo Precio (debe ser mayor)</label>
                <input
                    type="number"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(parseInt(e.target.value))}
                    required
                    min={productoSeleccionado?.precio + 1}
                />
                </div>

                <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModalPrecio(false)}>
                    Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <span className="loader-small"></span> : "Actualizar Precio"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

        {/* Modal Incrementar Stock */}
        {showModalStock && (
        <div className="modal-overlay" onClick={() => setShowModalStock(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Incrementar Stock</h2>
                <button className="modal-close" onClick={() => setShowModalStock(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <form onSubmit={actualizarStock} className="modal-form">
                <div className="form-group">
                <label>Producto</label>
                <input
                    type="text"
                    value={productoSeleccionado?.nombre_producto}
                    disabled
                    style={{ background: "#f7fafc", color: "#718096" }}
                />
                </div>

                <div className="form-group">
                <label>Stock Actual</label>
                <input
                    type="text"
                    value={productoSeleccionado?.stock}
                    disabled
                    style={{ background: "#f7fafc", color: "#718096" }}
                />
                </div>

                <div className="form-group">
                <label>Cantidad a Incrementar</label>
                <input
                    type="number"
                    value={nuevoStock}
                    onChange={(e) => setNuevoStock(parseInt(e.target.value))}
                    required
                    min="1"
                    placeholder="Ej: 10"
                />
                </div>

                <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModalStock(false)}>
                    Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <span className="loader-small"></span> : "Incrementar Stock"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
        {/* Modal Crear Producto */}
        {showModalCrear && (
        <div className="modal-overlay" onClick={() => setShowModalCrear(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Nuevo Producto</h2>
                <button className="modal-close" onClick={() => setShowModalCrear(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <form onSubmit={crearProducto} className="modal-form">
                <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                    type="text"
                    value={productoNuevo.nombre}
                    onChange={(e) => setProductoNuevo({...productoNuevo, nombre: e.target.value})}
                    required
                />
                </div>

                <div className="form-group">
                <label>Precio</label>
                <input
                    type="number"
                    value={productoNuevo.precio}
                    onChange={(e) => setProductoNuevo({...productoNuevo, precio: parseInt(e.target.value)})}
                    required
                    min="0"
                />
                </div>

                <div className="form-group">
                <label>Stock</label>
                <input
                    type="number"
                    value={productoNuevo.stock}
                    onChange={(e) => setProductoNuevo({...productoNuevo, stock: parseInt(e.target.value)})}
                    required
                    min="0"
                />
                </div>

                <div className="form-group">
                <label>Tipo</label>
                <select
                    value={productoNuevo.tipo}
                    onChange={(e) => setProductoNuevo({...productoNuevo, tipo: e.target.value})}
                    required
                >
                    <option value="Dulce">Dulce</option>
                    <option value="Salado">Salado</option>
                </select>
                </div>

                <div className="form-group">
                <label>Porciones</label>
                <input
                    type="number"
                    value={productoNuevo.porciones}
                    onChange={(e) => setProductoNuevo({...productoNuevo, porciones: parseInt(e.target.value)})}
                    required
                    min="1"
                />
                </div>

                <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModalCrear(false)}>
                    Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <span className="loader-small"></span> : "Crear Producto"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
        </div>
    );
}