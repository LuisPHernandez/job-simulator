# Job Simulator — REST CRUD API

## Descripción

API REST con operaciones CRUD completas sobre el recurso **products**, persistencia en PostgreSQL y entorno completo containerizado con Docker Compose (frontend + API + base de datos).

---

## Stack

- **Runtime:** Node.js + Express
- **Base de datos:** PostgreSQL 16
- **Containerización:** Docker Compose (3 servicios)
- **Frontend:** HTML/JS estático servido con Nginx

---

## Cómo levantar el sistema

```bash
docker compose up --build
```

Un único comando levanta los tres servicios. No se requiere configuración manual.

| Servicio  | URL local              |
| --------- | ---------------------- |
| Frontend  | http://localhost:8088  |
| API REST  | http://localhost:3000  |
| PostgreSQL| localhost:6000         |

---

## Variables de entorno

Las variables se definen en `.env` (ver `.env.example`):

| Variable            | Descripción                              |
| ------------------- | ---------------------------------------- |
| `DB_HOST`           | Host de PostgreSQL (valor: `db` en Docker) |
| `DB_PORT`           | Puerto interno de PostgreSQL (`5432`)    |
| `POSTGRES_DB`       | Requerido por la imagen oficial de Postgres |
| `POSTGRES_USER`     | Requerido por la imagen oficial de Postgres |
| `POSTGRES_PASSWORD` | Requerido por la imagen oficial de Postgres |
| `APP_PORT`          | Puerto en el que corre la API (`80`)     |

---

## Recurso: `products`

### Estructura

| Campo       | Tipo          | Restricciones              |
| ----------- | ------------- | -------------------------- |
| `id`        | integer       | primary key, autoincrement |
| `name`      | string        | requerido                  |
| `brand`     | string        | requerido                  |
| `category`  | string        | requerido                  |
| `stock`     | integer       | requerido                  |
| `price`     | float (10,2)  | requerido                  |
| `available` | boolean       | requerido                  |

### Esquema SQL (`init.sql`)

```sql
CREATE TABLE IF NOT EXISTS products (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  brand     VARCHAR(255) NOT NULL,
  category  VARCHAR(255) NOT NULL,
  stock     INTEGER NOT NULL,
  price     NUMERIC(10,2) NOT NULL,
  available BOOLEAN NOT NULL
);
```

El script se ejecuta automáticamente al primer arranque del contenedor de PostgreSQL.

---

## Endpoints

Base URL: `http://localhost:3000`

### `GET /products`
Retorna todos los productos.

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Laptop Pro",
    "brand": "Dell",
    "category": "Electronics",
    "stock": 50,
    "price": "999.99",
    "available": true
  }
]
```

---

### `GET /products/:id`
Retorna un producto por ID.

**Response `200`:** objeto del producto  
**Response `404`:** `{ "error": "Producto no encontrado" }`

---

### `POST /products`
Crea un nuevo producto. Todos los campos son requeridos.

**Body:**
```json
{
  "name": "Laptop Pro",
  "brand": "Dell",
  "category": "Electronics",
  "stock": 50,
  "price": 999.99,
  "available": true
}
```

**Response `201`:** objeto creado  
**Response `400`:** `{ "error": "<mensaje de validación>" }`

---

### `PUT /products/:id`
Reemplaza un producto completamente. Todos los campos son requeridos.

**Body:** mismo formato que POST  
**Response `200`:** objeto actualizado  
**Response `400`:** error de validación  
**Response `404`:** producto no encontrado

---

### `PATCH /products/:id`
Actualización parcial. Solo se modifican los campos presentes en el body; el resto permanece sin cambios.

**Body (ejemplo, cualquier subconjunto de campos):**
```json
{
  "stock": 30,
  "available": false
}
```

**Campos permitidos:** `name`, `brand`, `category`, `stock`, `price`, `available`  
**Response `200`:** objeto actualizado  
**Response `400`:** sin campos válidos o tipos incorrectos  
**Response `404`:** producto no encontrado

---

### `DELETE /products/:id`
Elimina un producto.

**Response `200`:** `{ "message": "Producto eliminado" }`  
**Response `404`:** `{ "error": "Producto no encontrado" }`

---

## Validaciones

- `name`, `brand`, `category`: strings no vacíos
- `stock`: debe ser entero (`Number.isInteger`)
- `price`: debe ser número decimal (`typeof === 'number'`)
- `available`: debe ser booleano (`typeof === 'boolean'`)
- Errores de validación retornan `400` con `{ "error": "..." }`

---

## Estructura del proyecto

```
.
├── docker-compose.yml       # Orquestación: frontend + api + db
├── Dockerfile               # Imagen de la API
├── init.sql                 # Esquema SQL (ejecutado automáticamente)
├── .env                     # Variables de entorno (no versionado)
├── .env.example             # Plantilla de variables
├── package.json
├── src/
│   ├── server.js            # Punto de entrada, middlewares, puerto
│   ├── db/
│   │   └── db.js            # Conexión a PostgreSQL (Pool)
│   └── routes/
│       └── products.js      # Rutas y lógica CRUD + validaciones
└── frontend/
    ├── Dockerfile           # Imagen Nginx del frontend
    ├── nginx.conf
    └── public/
        ├── index.html       # Lista de productos
        ├── create.html      # Formulario de creación
        ├── edit.html        # Formulario de edición
        ├── show.html        # Detalle de producto
        └── js/
            ├── config.js    # API_URL y RESOURCE
            ├── api.js       # Funciones fetch (getAll, getOne, create, update, remove)
            ├── index.js
            ├── create.js
            ├── edit.js
            └── show.js
```

---

## Frontend

El frontend se sirve en `http://localhost:8088` y se configura en `frontend/public/js/config.js`:

```js
window.API_URL = "http://localhost:3000";
window.RESOURCE = "products";
```

Los campos del frontend están adaptados al dominio real:

| API field   | Label en UI |
| ----------- | ----------- |
| `name`      | Name        |
| `brand`     | Brand       |
| `category`  | Category    |
| `stock`     | Stock       |
| `price`     | Price       |
| `available` | Available   |

---

## Entrega

- Repositorio en GitHub con visibilidad pública
- El sistema levanta con un único comando: `docker compose up --build`
- Nivel implementado: **Nivel 3 — Senior** + bonus de integración full stack + bonus de personalización del frontend
