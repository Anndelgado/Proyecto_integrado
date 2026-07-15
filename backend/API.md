# API Barranquilla Convive

## Users

### GET /api/v1/users
obtener todos los usuarios.

### GET /api/v1/users/:id
obtener usuario especifico por id.

### POST /api/v1/users
crear un nuevo usuario.

### PUT /api/v1/users/:id
actualizar un usuario especifico por id.

### DELETE /api/v1/users/:id
eleminar un usuario especifico.


## Institutions

### GET /api/v1/institutions
obtener todas las instituciones.

### GET /api/v1/institutions/:id
obtener institución especifica por id.

### POST /api/v1/institutions
crear una nueva institución.

### PUT /api/v1/institutions:id
actualizar una institución especifica por id.

### DELETE /api/v1/institutions/:id
eleminar una institución especifica.


## Alerts

### GET /api/v1/alerts
obtener todas las alertas.

### GET /api/v1/alerts/:id
obtener alerta especifica por id.

### POST /api/v1/alerts
crear una nueva alerta.

### PUT /api/v1/alerts/:id
actualizar una alerta existente.

### DELETE /api/v1/alerts/:id
eleminar una alerta existente.


## API Response Format

### Success

{
    "Success": true,
    "message": "Operation Completed Successfully.",
    "data": {}
}

### Error

{
    "Success": false,
    "message": "Description of error"
}