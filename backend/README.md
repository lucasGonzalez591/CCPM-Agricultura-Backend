# PAF - Productos de Agricultura Familiar

Sistema web para la Administración Pública que permite registrar **productores** y los **productos de agricultura familiar** que comercializan, con búsquedas, filtros combinables, reportes y estadísticas.

> Actividad 3 - Fecha de entrega: 23 de octubre de 2026.

## Integrantes

| Apellido y nombre | Usuario de GitHub |
|----------------|--------|
| Gonzalez Lucas |  lucasGonzalez591       |

## Tecnologías

| Componente   | Tecnología                          |
|--------------|-------------------------------------|
| Base de datos| MySQL 8                             |
| Backend      | Java 17+ y Spring Boot 4            |
| Persistencia | Spring Data JPA / Hibernate         |
| API          | REST (JSON)                         |
| Documentación| Swagger UI (springdoc-openapi)      |
| Frontend     | React _(en desarrollo)_             |
| Versionado   | Git y GitHub                        |

## Funcionalidades

- CRUD completo de **productores** y **productos**.
- Cada productor puede tener múltiples productos.
- Cada producto admite **hasta 3 fotografías**, almacenadas en **Base64**.
- Validación de datos (formato de DNI, email, precios, límite de fotos, etc.).
- Búsqueda por apellido y nombre.
- **Filtros combinables** por apellido, nombre, DNI, sexo, departamento, municipio, nombre del producto, lugar de venta y rango de precios.
- **Reportes y estadísticas**: cantidad de productores y productos, productores por departamento y municipio, productos por productor, precios promedio y distribución de productos por lugar de venta.
- Manejo de errores HTTP con un formato de respuesta uniforme.

## Requisitos previos

- JDK 17 o superior
- Maven 3.9+ (o usar el wrapper `mvnw` incluido en el proyecto)
- MySQL 8 en ejecución
- Git

## Instalación y ejecución del backend

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <CARPETA_DEL_PROYECTO>
```

### 2. Configurar la base de datos

La aplicación usa la base `db_agricultura` en `localhost:3306`. Hibernate crea las tablas automáticamente al iniciar.

Abrí `src/main/resources/application.properties` y ajustá el usuario y la contraseña de tu MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_agricultura?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Con `createDatabaseIfNotExist=true` no hace falta crear la base manualmente.

Si preferís crear las tablas con el script SQL en lugar de dejar que Hibernate las genere, ejecutá antes el archivo [`database/schema.sql`](database/schema.sql).

### 3. Ejecutar la aplicación

```bash
./mvnw spring-boot:run
```

En Windows: `mvnw.cmd spring-boot:run`. También se puede ejecutar la clase principal desde IntelliJ IDEA.

El backend queda disponible en **http://localhost:8080**.

### 4. Probar la API

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Especificación OpenAPI (JSON)**: http://localhost:8080/v3/api-docs

Desde Swagger se puede probar cada endpoint con el botón **Try it out**.

## Estructura del proyecto (backend)

```
com.agricultura
├── config          Configuración (CORS, OpenAPI)
├── controller      Controllers REST
├── dto
│   ├── filtro      Parámetros de búsqueda
│   ├── request     Datos de entrada (con validaciones)
│   └── response    Datos de salida
├── exception       Excepciones propias y manejador global de errores
├── mapper          Conversión entre entidades y DTO
├── model           Entidades JPA (Productor, Producto, Sexo)
├── repository      Repositorios Spring Data (+ projection para reportes)
├── service         Interfaces de la lógica de negocio
│   └── impl        Implementaciones
└── specification   Filtros dinámicos con JPA Specifications
```

Arquitectura en capas: **Controller → Service → Repository → Base de datos**, usando DTO para no exponer las entidades.

## Modelo de datos

```
PRODUCTORES (1) ────────< (N) PRODUCTOS (1) ────────< (N) PRODUCTO_FOTOS
```

- **productores**: id, apellido, nombre, dni (único), sexo, telefono, email, max_titulo, fecha_nacimiento, departamento, municipio, domicilio.
- **productos**: id, nombre, descripcion, precio_unitario, lugar_venta, productor_id (FK a productores).
- **producto_fotos**: producto_id (FK a productos), foto_base64 (LONGTEXT). Máximo 3 filas por producto.

Al eliminar un productor se eliminan también sus productos y fotos.

## Endpoints principales

### Productores - `/api/productores`

| Método | Ruta                          | Descripción                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/api/productores`            | Lista productores (acepta filtros)       |
| GET    | `/api/productores/{id}`       | Detalle de un productor                  |
| GET    | `/api/productores/{id}/productos` | Productos de un productor            |
| POST   | `/api/productores`            | Crea un productor                        |
| PUT    | `/api/productores/{id}`       | Modifica un productor                    |
| DELETE | `/api/productores/{id}`       | Elimina un productor y sus productos     |

### Productos - `/api/productos`

| Método | Ruta                    | Descripción                               |
|--------|-------------------------|-------------------------------------------|
| GET    | `/api/productos`        | Lista productos (acepta filtros, sin fotos)|
| GET    | `/api/productos/{id}`   | Detalle de un producto (con fotos)        |
| POST   | `/api/productos`        | Crea un producto                          |
| PUT    | `/api/productos/{id}`   | Modifica un producto                      |
| DELETE | `/api/productos/{id}`   | Elimina un producto                       |

### Filtros combinables

Todos los parámetros son opcionales y se pueden combinar. Las búsquedas de texto son parciales y no distinguen mayúsculas.

**Productores** (`GET /api/productores`): `apellido`, `nombre`, `dni`, `sexo` (`MASCULINO`, `FEMENINO`, `OTRO`), `departamento`, `municipio`, `producto`, `lugarVenta`, `precioMin`, `precioMax`.

**Productos** (`GET /api/productos`): `nombre`, `lugarVenta`, `precioMin`, `precioMax`, `productorApellido`, `productorNombre`, `productorDni`, `sexo`, `departamento`, `municipio`.

Ejemplos:

```
GET /api/productores?apellido=gom&departamento=Capital
GET /api/productos?lugarVenta=feria&precioMin=1000&precioMax=4000
```

### Reportes y estadísticas - `/api/reportes`

| Método | Ruta                                       | Descripción                                   |
|--------|--------------------------------------------|-----------------------------------------------|
| GET    | `/api/reportes/resumen`                    | Totales, promedio de productos por productor y precios (promedio, mínimo, máximo) |
| GET    | `/api/reportes/productores-por-departamento` | Cantidad de productores por departamento    |
| GET    | `/api/reportes/productores-por-municipio`  | Cantidad de productores por municipio         |
| GET    | `/api/reportes/productos-por-productor`    | Cantidad de productos de cada productor       |
| GET    | `/api/reportes/productos-por-lugar-venta`  | Distribución de productos por lugar de venta  |
| GET    | `/api/reportes/precio-promedio-por-producto` | Precio promedio por nombre de producto      |

## Ejemplos de datos

**Crear un productor** (`POST /api/productores`):

```json
{
  "apellido": "Benítez",
  "nombre": "Carolina",
  "dni": "32456789",
  "sexo": "FEMENINO",
  "telefono": "3764555101",
  "email": "carolina.benitez@mail.com",
  "maximoTitulo": "Técnico agropecuario",
  "fechaNacimiento": "1988-06-15",
  "departamento": "Capital",
  "municipio": "Posadas",
  "domicilio": "Av. Mitre 1520"
}
```

**Crear un producto** (`POST /api/productos`):

```json
{
  "nombre": "Miel de abeja",
  "descripcion": "Miel pura, frasco de 500 g",
  "precioUnitario": 4500.50,
  "lugarVenta": "Feria Franca de Posadas",
  "productorId": 1,
  "fotos": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  ]
}
```

## Manejo de errores

Todos los errores devuelven el mismo formato JSON:

```json
{
  "timestamp": "2026-10-08T08:44:41",
  "status": 400,
  "error": "Bad Request",
  "message": "Datos inválidos",
  "path": "/api/productores",
  "fieldErrors": {
    "email": "Email inválido"
  }
}
```

| Código | Cuándo ocurre                                                        |
|--------|----------------------------------------------------------------------|
| 400    | Datos inválidos, más de 3 fotos, rango de precios incorrecto, parámetros mal formados |
| 404    | El productor o el producto no existe                                 |
| 409    | DNI duplicado o violación de una restricción de la base de datos     |
| 500    | Error interno inesperado                                             |

## Frontend (React)

_En desarrollo. Esta sección se completará con las instrucciones de instalación y ejecución del frontend (Node.js, `npm install`, `npm run dev`) y la URL donde queda disponible._

## Git y GitHub

El repositorio contiene:

- `src/` - código del backend (Spring Boot)
- `frontend/` - código del frontend (React) _(pendiente)_
- `database/` - scripts de la base de datos
- `README.md`

## Uso de Inteligencia Artificial

Se utilizaron herramientas de IA como apoyo durante el desarrollo (consultas conceptuales, análisis de errores y propuestas de código). Todos los integrantes pueden explicar y defender el funcionamiento del código presentado.