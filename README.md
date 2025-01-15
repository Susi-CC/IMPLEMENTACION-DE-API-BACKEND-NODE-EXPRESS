# Práctica de consolidación del módulo 8 "Implementación de API BackEnd Node Express".
## Curso FullStack JavaScript

Este proyecto consiste en la implementación de una API Backend utilizando **Node.js**, **Express**, **Sequelize** y **PostgreSQL**. La API permite a los usuarios registrarse, iniciar sesión, gestionar bootcamps, y asignar usuarios a bootcamps. Además, se incluye la validación mediante **JWT (JSON Web Tokens)** para garantizar la seguridad en las rutas protegidas.

---

## Características

- **Autenticación JWT**: Implementación de un sistema seguro de autenticación basado en tokens.
- **Gestión de Usuarios**:
  - Registro de usuarios con validaciones de correo único y contraseñas seguras.
  - Inicio de sesión para obtener un token de acceso.
- **Gestión de Bootcamps**:
  - Creación de bootcamps por usuarios registrados.
  - Consulta pública de bootcamps con usuarios asociados.
- **Relaciones**:
  - Asignación de usuarios a bootcamps.
  - Consulta de usuarios registrados en un bootcamp.
- **Base de Datos**:
  - Uso de **PostgreSQL** como sistema de almacenamiento.
  - Modelos definidos con **Sequelize**.

---

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para la creación de APIs.
- **Sequelize**: ORM para la gestión de bases de datos.
- **PostgreSQL**: Base de datos relacional.
- **JWT**: Sistema de autenticación basado en tokens.
- **bcryptjs**: Cifrado de contraseñas.

---

## Requisitos Previos

1. Tener instalado **Node.js** y **npm**.
2. Contar con una instancia de **PostgreSQL** configurada.
3. Clonar este repositorio:
   ```bash
   git clone https://github.com/Susi-CC/IMPLEMENTACION-DE-API-BACKEND-NODE-EXPRESS.git
   ```
4. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_de_tu_base_de_datos
   AUTH_SECRET=tu_secreto_jwt
   ```

5. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

---

## Uso

### Iniciar el Servidor

1. **Producción**:
   Inicia el servidor en modo producción:
   ```bash
   npm start
   ```

2. **Desarrollo**:
   Utiliza nodemon para reiniciar automáticamente el servidor en cada cambio:
   ```bash
   npm run dev
   ```

---

## Rutas Disponibles

### Usuarios

| Método | Ruta              | Descripción                                  |
|--------|-------------------|----------------------------------------------|
| POST   | `/api/user/signup`| Registrar un nuevo usuario.                  |
| POST   | `/api/user/signin`| Iniciar sesión y obtener un token de acceso. |
| GET    | `/api/user/:id`   | Obtener información de un usuario por ID.    |
| PUT    | `/api/user/:id`   | Actualizar información de un usuario.        |
| DELETE | `/api/user/:id`   | Eliminar un usuario por ID.                  |

### Bootcamps

| Método | Ruta                       | Descripción                                      |
|--------|----------------------------|--------------------------------------------------|
| POST   | `/api/bootcamp`            | Crear un nuevo bootcamp.                         |
| GET    | `/api/bootcamp`            | Obtener todos los bootcamps (consulta pública).  |
| GET    | `/api/bootcamp/:id`        | Obtener un bootcamp con los usuarios asociados.  |
| POST   | `/api/bootcamp/adduser`    | Asignar un usuario a un bootcamp.                |

---

## Ejemplo de Uso con Postman

### Registro de Usuario
- **Endpoint**: `POST /api/user/signup`
- **Body**:
   ```json
   {
       "firstName": "Juan",
       "lastName": "Pérez",
       "email": "juan.perez@correo.com",
       "password": "ContraseñaSegura123"
   }
   ```

### Inicio de Sesión
- **Endpoint**: `POST /api/user/signin`
- **Body**:
   ```json
   {
       "email": "juan.perez@correo.com",
       "password": "ContraseñaSegura123"
   }
   ```
- **Respuesta**:
   ```json
   {
       "id": 1,
       "firstName": "Juan",
       "lastName": "Pérez",
       "email": "juan.perez@correo.com",
       "accessToken": "token_generado"
   }
   ```

### Crear un Bootcamp
- **Endpoint**: `POST /api/bootcamp`
- **Headers**:
  - Authorization: `Bearer <token>`
- **Body**:
   ```json
   {
       "title": "Bootcamp Node.js",
       "description": "Aprende Node.js desde cero",
       "cue": 10
   }
   ```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, sigue los siguientes pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama con tu mejora:
   ```bash
   git checkout -b feature/nueva-mejora
   ```
3. Realiza los cambios y haz commits:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. Haz un push de tu rama:
   ```bash
   git push origin feature/nueva-mejora
   ```
5. Abre un Pull Request describiendo los cambios realizados.

---

## Licencia

Este proyecto está licenciado bajo la **ISC License**.

---



