# Productos de Agricultura Familiar

Aplicación web para administrar productores de agricultura familiar y los productos que comercializan. Permite registrar y consultar productores y productos, aplicar filtros y revisar reportes y estadísticas.

## Tecnologías

- **Backend:** Java 17, Spring Boot, Spring Data JPA y Maven.
- **Base de datos:** MySQL.
- **Frontend:** React, Vite y npm.
- **API:** REST con documentación OpenAPI/Swagger.

## Requisitos

- Java 17 o superior.
- MySQL en ejecución.
- Node.js `^20.19.0` o `>=22.12.0`, y npm (requisito de Vite 8).

El proyecto incluye el wrapper de Maven (`mvnw`), por lo que no hace falta instalar Maven aparte.

## Puesta en marcha

Para usar la aplicación completa, iniciá el backend y el frontend en terminales separadas. La base de datos debe estar disponible antes de iniciar el backend.

### 1. Configurar MySQL

La aplicación se conecta por defecto a `localhost:3306` y usa la base `db_agricultura`. La URL de conexión incluye `createDatabaseIfNotExist=true`, por lo que MySQL puede crear la base al iniciar la aplicación si el usuario tiene permisos.

El usuario predeterminado es `root`. Para indicar las credenciales de tu instalación, definí las variables de entorno antes de iniciar el backend.

**Windows PowerShell:**

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "tu_clave_de_mysql"
```

**Linux/macOS:**

```bash
export DB_USER=root
export DB_PASSWORD=tu_clave_de_mysql
```

Si usás otros valores de conexión o un puerto distinto, revisá `backend/src/main/resources/application.properties`.

### 2. Iniciar el backend

Desde la carpeta raíz del repositorio:

**Windows PowerShell:**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Linux/macOS:**

```bash
cd backend
./mvnw spring-boot:run
```

El backend queda disponible en <http://localhost:8080>. La primera ejecución puede tardar mientras Maven descarga las dependencias. Hibernate actualiza el esquema de la base al iniciar.

### 3. Iniciar el frontend

Abrí otra terminal en la carpeta raíz del repositorio:

```bash
cd frontend
npm ci
npm run dev
```

Vite muestra en la terminal la dirección local; normalmente es <http://localhost:5173>. Abrí esa dirección en el navegador. El frontend reenvía las solicitudes `/api` al backend en `http://localhost:8080`.

## Documentación y endpoints

- **Aplicación web:** <http://localhost:5173>
- **Swagger UI:** <http://localhost:8080/swagger-ui/index.html>
- **OpenAPI JSON:** <http://localhost:8080/v3/api-docs>

Los endpoints principales de la API son:

- `/api/productores`: gestión y consulta de productores.
- `/api/productos`: gestión y consulta de productos.
- `/api/reportes`: reportes y estadísticas.

## Comandos útiles

Desde `backend`:

```powershell
.\mvnw.cmd test
```

En Linux/macOS, reemplazá `.\mvnw.cmd` por `./mvnw`.

Desde `frontend`:

```bash
npm run lint
npm run build
```
