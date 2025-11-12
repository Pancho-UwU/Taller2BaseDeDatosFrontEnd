# 🎯 Proyecto React - Gestión de Clientes y Ventas

Este es un proyecto desarrollado en React con Vite para la gestión de clientes, productos y ventas. Ideal para estudiantes que están aprendiendo React por primera vez.

## 🚀 Para Estudiantes - Cómo Clonar y Ejecutar el Proyecto

### 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- Node.js (versión 16 o superior)
- Git

## 🔧 Pasos para Configurar el Proyecto

### 1. Clonar el Repositorio
```bash
# Abre tu terminal y ejecuta:
git clone https://github.com/Pancho-UwU/Taller2BaseDeDatosFrontEnd.git

# Entra a la carpeta del proyecto:
cd Taller2BaseDeDatosFrontEnd
```

### 2. Instalar Dependencias
```bash
# Instala todas las librerías necesarias:
npm install
```

### 3. Configurar el Backend

Asegúrate de que tu servidor backend esté ejecutándose en:
```
http://localhost:3000
```

### 4. Ejecutar el Proyecto
```bash
# Inicia el servidor de desarrollo:
npm run dev
```

### 5. Abrir en el Navegador

Una vez ejecutado, verás en la terminal:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Abre tu navegador y ve a: http://localhost:5173

## 🎮 Características del Proyecto

### 📱 Páginas Disponibles

- **Login** - Inicio de sesión
- **Gestión de Clientes** - CRUD completo de clientes
- **Gestión de Productos** - Administración de productos
- **Crear Ventas** - Registro de nuevas ventas
- **Reportes** - Consulta de reportes de ventas

### 🛠️ Tecnologías Utilizadas

- ⚛️ **React** - Biblioteca principal
- ⚡ **Vite** - Herramienta de build rápida
- 🎨 **CSS** - Estilos personalizados
- 🔄 **React Router** - Navegación entre páginas
- 📡 **Axios** - Peticiones HTTP al backend

## 📁 Estructura del Proyecto
```
src/
├── auth/
│   ├── pages/          # Páginas protegidas
│   │   ├── crudCliente.jsx
│   │   ├── crudProductos.jsx
│   │   ├── crearVenta.jsx
│   │   └── reporte.jsx
├── components/         # Componentes reutilizables
├── css/               # Archivos de estilos
├── pages/             # Páginas públicas
│   └── login.jsx
└── App.jsx            # Componente principal
```

## 🎯 Para Estudiantes - Conceptos que Aprenderás

### 🔑 Autenticación
- Manejo de tokens JWT
- Rutas protegidas
- Persistencia de sesión

### 📊 CRUD Operations
- **Create (Crear)** - Agregar nuevos clientes/productos
- **Read (Leer)** - Listar y consultar datos
- **Update (Actualizar)** - Modificar registros
- **Delete (Eliminar)** - Remover elementos

### 🎨 Componentes React
- Hooks (useState, useEffect)
- Manejo de estado
- Props y comunicación entre componentes
- Formularios controlados

### 🌐 Comunicación con API
- Peticiones HTTP (GET, POST, PATCH, DELETE)
- Manejo de headers con autenticación
- Gestión de errores
- Estados de carga

## 🚨 Solución de Problemas Comunes

### ❌ Error: "Cannot find module"
```bash
# Elimina node_modules y reinstala:
rm -rf node_modules
npm install
```

### ❌ Error: "Port already in use"
```bash
# Usa un puerto diferente:
npm run dev -- --port 3001
```

### ❌ Error de CORS

- Verifica que el backend tenga CORS configurado
- Asegúrate de que las URLs del backend sean correctas

## 📚 Comandos Útiles
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Vista previa del build

# Limpieza
npm run lint         # Verificar código
```

## 🎓 Tips para Estudiantes

1. **Empieza por el login** - Comprende cómo funciona la autenticación
2. **Revisa los componentes** - Entiende cómo se comunican entre sí
3. **Prueba las funcionalidades** - Crea, edita y elimina registros
4. **Inspecciona las peticiones** - Usa las DevTools para ver las llamadas al API
5. **Modifica el código** - Experimenta cambiando estilos y funcionalidades

## 📞 Soporte

Si tienes dudas sobre el proyecto:
- Revisa la [documentación de React](https://react.dev/)
- Consulta la [documentación de Vite](https://vitejs.dev/)
- Revisa los issues en el repositorio

---

¡Feliz coding! 🎉
