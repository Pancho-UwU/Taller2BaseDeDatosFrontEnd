import {Routes, Route} from "react-router-dom";
import Login from "./pages/login.jsx";
import CrudClient from "./auth/pages/crudCliente.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CrearVenta from "./auth/pages/crearVenta.jsx";
import CrudProductos from "./auth/pages/crudProductos.jsx";
import Reporte from "./auth/pages/reporte.jsx";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/cliente" element={<PrivateRoute><CrudClient/></PrivateRoute>}/>
      <Route path="/crear-venta" element={<PrivateRoute><CrearVenta/></PrivateRoute>}/>
      <Route path="/productos" element={<PrivateRoute><CrudProductos/></PrivateRoute>}/>
      <Route path="/reporte" element={<PrivateRoute><Reporte/></PrivateRoute>}/>
    </Routes>
  );
}

export default App;