import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/CrearVenta.css";

export default function CrearVenta() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");
  const getIdCliente = () => localStorage.getItem("id_cliente_venta");

  useEffect(() => {
    const idCliente = getIdCliente();
    if (!idCliente) {
      navigate("/dashboard");
      return;
    }
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/producto/all", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setProductos(res.data.data);
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

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id_producto === producto.id_producto);
    
    if (existe) {
      if (existe.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        setError("Stock insuficiente");
        setTimeout(() => setError(""), 3000);
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const modificarCantidad = (id_producto, nuevaCantidad) => {
    const producto = productos.find(p => p.id_producto === id_producto);
    
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter(item => item.id_producto !== id_producto));
    } else if (nuevaCantidad <= producto.stock) {
      setCarrito(carrito.map(item =>
        item.id_producto === id_producto
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      setError("Stock insuficiente");
      setTimeout(() => setError(""), 3000);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const realizarVenta = async () => {
    if (carrito.length === 0) {
      setError("Agregue al menos un producto");
      return;
    }

    setLoading(true);
    try {
      const ventaData = {
        idCliente: parseInt(getIdCliente()),
        productos: carrito.map(item => ({
            idProducto: item.id_producto,
            cantidad: item.cantidad,
            precio: item.precio
        }))
      };

      await axios.post("http://localhost:3000/api/producto/crearVenta", ventaData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      localStorage.removeItem("id_cliente_venta");
      navigate("/cliente");
    } catch (error) {
      setError("Error al realizar la venta");
    } finally {
      setLoading(false);
    }
  };

  const cancelarVenta = () => {
    localStorage.removeItem("id_cliente_venta");
    navigate("/cliente");
  };

  return (
    <div className="venta-container">
      <div className="venta-header">
        <h1 className="venta-title">Nueva Venta</h1>
        <button onClick={cancelarVenta} className="btn-cancelar-venta">
          Cancelar
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="venta-content">
        {/* Lista de Productos */}
        <div className="productos-section">
          <h2>Productos Disponibles</h2>
          {loading && productos.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="productos-grid">
              {productos.filter(p => p.estado === 1).map((producto) => (
                <div key={producto.id_producto} className="producto-card">
                  <div className="producto-info">
                    <h3>{producto.nombre_producto}</h3>
                    <p className="producto-tipo">{producto.tipo}</p>
                    <p className="producto-porciones">Porciones: {producto.porciones}</p>
                    <p className="producto-stock">Stock: {producto.stock}</p>
                    <p className="producto-precio">${producto.precio.toLocaleString()}</p>
                  </div>
                  <button
                    className="btn-agregar"
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                  >
                    {producto.stock === 0 ? "Sin Stock" : "Agregar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carrito */}
        <div className="carrito-section">
          <h2>Carrito de Compra</h2>
          {carrito.length === 0 ? (
            <div className="carrito-vacio">
              <p>No hay productos en el carrito</p>
            </div>
          ) : (
            <>
              <div className="carrito-items">
                {carrito.map((item) => (
                  <div key={item.id_producto} className="carrito-item">
                    <div className="item-info">
                      <h4>{item.nombre_producto}</h4>
                      <p>${item.precio.toLocaleString()} c/u</p>
                    </div>
                    <div className="item-cantidad">
                      <button
                        onClick={() => modificarCantidad(item.id_producto, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => modificarCantidad(item.id_producto, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-subtotal">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="carrito-total">
                <h3>Total: ${calcularTotal().toLocaleString()}</h3>
                <button
                  className="btn-realizar-venta"
                  onClick={realizarVenta}
                  disabled={loading}
                >
                  {loading ? <span className="loader-small"></span> : "Realizar Venta"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}