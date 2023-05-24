# Users API

## Requerimientos

- Docker

## Como Iniciar?
Clonar el repositorio

```bash
git clone https://github.com/hoffme/users-api.git
```

Ingresar el el root de la carpeta

```bash
cd users-api
```

Crear archivo .env.
todas las variables son opcionales, pero el archivo tiene que existir

```bash
touch .env
```

| Varible          | Descripcion                                      | Default                                     |
|------------------|--------------------------------------------------|---------------------------------------------|
| ENV              | production o development                         | development                                 |
| PORT             | puerto del servidor                              | :4000                                       |
| POSTGRES_PATH    | uri del la base de datos postgres                | postgresql://postgres:1234@db:5432/postgres |
| JWT_SECRET       | secreto de para crear tokens jwt                 | shh                                         |
| PASSWORD_ROUNDS  | cantidad de vueltas para encriptar la contraseña | 10                                          |
| SESSION_DURATION | duracion de la session del usuario en segundos   | 30 dias                                     |
| ACCESS_DURATION  | duracion del accesso del usuario en segundos     | 10 minutos                                  |

Inicializar servidor con docker

```bash
docker compose up -d
```

## Seeds

port defecto se crea el siguiente usuario

```json
{
  "name": "Usuario Root",
  "email": "test@test.com",
  "phone": "54 12 3456 8900",
  "address": "Buenos Aires, Argentina",
  "password": "123456"
}
```

## Documentacion de Endpoints

Una vez inicializado el servidor y poner la variable de entorno
```ENV=development``` puede ingresar a http://locahost:4000/docs 
para obtener los endpoints disponibles, como alternativa tiene
el documento de open api [aqui](docs/swagger.json)
