# carrito-app — Frontend del Carrito de Compras

Aplicación web en Angular que consume **CarritoApi**. Permite iniciar sesión, buscar productos, gestionar el carrito, confirmar la compra y revisar el historial de órdenes.

## Tecnologías

- Angular 22 (componentes standalone, sin zone.js)
- TypeScript 6
- Reactive Forms
- RxJS y signals para el estado
- CSS propio, sin librerías de UI

## Requisitos

- Node.js **22.22+** o **24.15+** (verificar con `node -v`)
- npm 10 o superior
- **CarritoApi** corriendo en `http://localhost:5080` (ver el README del backend)

## Instalación
npm install


Abrir http://localhost:4200

- `npm install` solo es necesario la primera vez, o cuando cambia `package.json`.
- `npm start` usa la versión de Angular CLI instalada en el proyecto. También funciona `ng serve` si el CLI global es Angular 22.


## Usuarios de prueba

Usuario - Contraseña - Rol
`cliente`-`Cliente123!` - Cliente
`admin` - `Admin123!` - Admin 

## Configuración por ambiente

Archivo | Se usa en | `apiUrl` |
src/environments/environment.ts` `npm start` (desarrollo) | `http://localhost:5080/api` |
src/environments/environment.prod.ts`  `npm run build` (producción) | cambiar por la URL pública de la API |

## Funcionalidades

### Inicio de sesión
- Formulario con validaciones (campos obligatorios y longitud mínima) y opción para mostrar u ocultar la contraseña.
- El token se guarda en `localStorage` junto con su fecha de vencimiento. Al vencer, la sesión se cierra.
- Las rutas privadas están protegidas. Si se entra sin sesión, se redirige al login y, después de iniciar sesión, se vuelve a la página solicitada.

### Productos
- Listado en tabla con código, nombre, descripción, categoría, precio y stock.
- Búsqueda por nombre, código o categoría. Espera 350 ms después de que el usuario deja de escribir, para no hacer una petición por cada tecla.
- Filtros por categoría, rango de precio y "solo con stock", y paginación.
- Los productos agotados se muestran deshabilitados. No permite agregar más unidades que el stock disponible, contando también lo que ya está en el carrito.

### Carrito
- Aumentar, disminuir, quitar productos y vaciar el carrito.
- Muestra el subtotal por producto, el descuento (10% cuando el subtotal supera $100) y el total.
- Si el stock de un producto bajó, lo marca y permite ajustar la cantidad con un clic.
- El menú superior muestra un contador con las unidades del carrito.

### Confirmación de compra
- Resumen final antes de comprar, recargado desde el servidor con precios y stock actualizados.
- Si otro usuario compró y el stock ya no alcanza, muestra el error y recarga el carrito.
- Al confirmar, muestra el detalle de la orden generada.

### Historial de compras
- Listado de órdenes con fecha, unidades, subtotal, descuento y total.
- Detalle de cada orden con los productos comprados.

### Experiencia de usuario
- Indicadores de carga, mensajes de error con opción de reintentar, y mensajes cuando no hay resultados o el carrito está vacío.
- Notificaciones temporales para acciones como agregar, quitar o comprar.
- Diseño responsive: en pantallas pequeñas, la tabla de productos se muestra como tarjetas.

## Estructura del proyecto
src/
	app/
		core/
			guards/          authGuard (rutas privadas) y guestGuard (login)
			interceptors/    agrega el token a cada petición y cierra sesión ante un 401
			models/          interfaces que reflejan el JSON de la API
			services/        auth, product, cart, order y notification
			utils/           traducción de errores HTTP a mensajes para el usuario
		layout/              menú superior y contenedor de las páginas internas
		shared/components/   spinner y notificaciones
		features/
			auth/login/
			products/product-list/
			cart/            carrito y resumen de totales reutilizable
			checkout/
			orders/          historial y detalle de orden
		app.config.ts        proveedores: router, HttpClient e interceptor
		app.routes.ts        rutas con carga diferida (lazy loading)
		app.ts               componente raíz
	environments/
	index.html
	main.ts
	styles.css               estilos globales y clases reutilizables
