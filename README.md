
# Sistema POS - Documentación Técnica

## Estructura del Proyecto

- `/services/sso`: Microservicio de autenticación y gestión de usuarios (Node.js, Express, TypeScript)
- `/services/pos`: Microservicio de punto de venta y gestión de productos/ventas (Node.js, Express, TypeScript)
- `/packages/core/auth-middleware`: Middleware JWT reutilizable
- `/db`: Esquema y funciones SQL para PostgreSQL
- `/frontend`: SPA en React + TypeScript

---

## Backend SSO-service

- **POST /auth/login**: Recibe `email` y `password`, retorna JWT con `user_id`, `role_name`, `client_id`.
- **POST /usuarios**: Solo ADMIN, crea usuarios con contraseña hasheada.
- **Middleware**: `verifyToken` decodifica JWT y adjunta datos al `req`.

## Backend POS-service

- **GET /productos/search?q=...**: Busca productos por nombre, SKU o código de barras.
- **GET /productos/{id}**: Obtiene precio y stock.
- **POST /ventas**: Recibe venta, invoca `registrar_venta_atomica` en PostgreSQL.

## Base de Datos

- Tablas: `roles`, `usuarios`, `clientes`, `configuracion_sistema`, `productos`, `movimientos_stock`, `ventas`, `detalles_venta`.
- Función: `registrar_venta_atomica(data_venta JSON)` para venta ACID.

## Frontend React SPA

- **/login**: Página de login, almacena JWT y redirige según rol.
- **/pos**: Interfaz de 3 columnas (Búsqueda, Carrito, Checkout).
- **/dashboard**: Vista para ADMIN.
- **Context API**: Manejo de estado del carrito.

---

## Pruebas Automáticas

- **Backend**: Tests con Jest y Supertest en `/tests` de cada microservicio.
- **Frontend**: Tests con React Testing Library en `/src/__tests__`.

---

## Instalación y Ejecución

1. Instalar dependencias en cada microservicio y frontend:
	```bash
	cd services/sso && npm install
	cd services/pos && npm install
	cd frontend && npm install
	```
2. Configurar variables de entorno (`.env`) para conexión a PostgreSQL y JWT_SECRET.
3. Ejecutar servicios:
	```bash
	cd services/sso && npm run dev
	cd services/pos && npm run dev
	cd frontend && npm start
	```

---

## Notas
- Dockerización y despliegue pueden agregarse según necesidad.
- Para pruebas, usar los scripts de test en cada servicio.
- El middleware de autenticación se importa desde `@core/auth-middleware`.

---

## Contacto
DaniPerego

---
