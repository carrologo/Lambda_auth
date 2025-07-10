# Lambda Authentication Service

Servicio de autenticación con arquitectura hexagonal que genera tokens JWT para acceso a otras lambdas.

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura hexagonal (Clean Architecture) con las siguientes capas:

```
src/
├── application/          # Casos de uso
│   └── use-cases/
│       ├── AuthenticateUser.ts    # Lógica de autenticación
│       └── ValidateToken.ts       # Lógica de validación de tokens
├── domain/              # Entidades y repositorios
│   ├── entities/
│   │   └── User.ts              # Entidad Usuario
│   └── repositories/
│       └── UserRepository.ts    # Interface del repositorio
└── infrastructure/     # Implementaciones concretas
    ├── database/
    │   └── SupabaseUserRepository.ts  # Implementación con Supabase
    └── lambdas/
        └── handler.ts              # Handler principal
```

## 🚀 Funcionalidades

- **Autenticación de usuarios**: Valida username y contraseña contra base de datos
- **Generación de JWT**: Crea tokens JWT con información del usuario
- **Contraseñas encriptadas**: Usa bcrypt para hash de contraseñas
- **Integración con Supabase**: Base de datos PostgreSQL
- **API Gateway compatible**: Configurado para trabajar con AWS API Gateway

## 📋 Requisitos

- Node.js 18+
- AWS CLI configurado
- Cuenta de Supabase
- Serverless Framework

## 🛠️ Configuración

### 1. Variables de Entorno

Configura estas variables de entorno en GitHub Secrets:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
JWT_SECRET=tu-jwt-secret-super-seguro
```

### 2. Tabla de Base de Datos

Ejecuta este SQL en tu base de datos Supabase:

```sql
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "role" TEXT DEFAULT 'user',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Crear Usuario de Prueba

Usa el script incluido para generar un usuario:

```bash
node scripts/createUser.js
```

Luego ejecuta el SQL generado en tu base de datos.

## 📦 Instalación

```bash
npm install
```

## 🏃‍♂️ Desarrollo Local

```bash
npm run dev
```

Esto iniciará serverless-offline en el puerto 3000.

## 🚀 Despliegue

### Despliegue automático con GitHub Actions

El proyecto se despliega automáticamente cuando haces push a:

- `main` → Entorno de producción
- `develop` → Entorno de desarrollo

### Despliegue manual

```bash
# Desarrollo
npm run deploy

# Producción
npx serverless deploy --stage prod
```

## 🔌 API Endpoints

### POST /auth/login

Autentica un usuario y devuelve un JWT.

**Request:**

```json
{
  "username": "admin",
  "password": "miPassword123"
}
```

**Response (200):**

```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

**Response (401):**

```json
{
  "message": "Invalid credentials"
}
```

## 🔐 Configuración de API Gateway

En la consola de AWS API Gateway:

1. **Crear API Key:**

   - Ve a API Keys
   - Crea una nueva API Key
   - Asóciala con un Usage Plan

2. **Configurar el endpoint:**

   - Habilita "API Key Required" en el método POST
   - Configura CORS si es necesario

3. **Autorización:**
   - Los clientes deben enviar el API Key en el header `x-api-key`
   - El cuerpo debe contener `username` y `password`

## 🔒 Uso del Token JWT

El token JWT generado contiene:

```json
{
  "userId": 1,
  "username": "admin",
  "role": "admin",
  "exp": 1640995200
}
```

**Para usar en otras lambdas:**

```javascript
const jwt = require("jsonwebtoken");

// En el header Authorization: Bearer <token>
const token = event.headers.Authorization.replace("Bearer ", "");
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

## 🧪 Testing

Para probar localmente con curl:

```bash
# Autenticación
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu-api-key" \
  -d '{"username": "admin", "password": "miPassword123"}'
```

## 📁 Estructura del Proyecto

```
Lambda_auth/
├── src/                 # Código fuente
├── scripts/             # Scripts de utilidad
├── .github/workflows/   # GitHub Actions
├── package.json         # Dependencias
├── serverless.yml       # Configuración de Serverless
├── tsconfig.json        # Configuración de TypeScript
└── README.md           # Este archivo
```

## 🔄 CI/CD

El proyecto incluye GitHub Actions que:

1. Instala dependencias
2. Configura AWS credentials
3. Despliega con Serverless Framework
4. Configura variables de entorno

## 🐛 Troubleshooting

### Error: "Invalid credentials"

- Verifica que el username existe en la tabla
- Verifica que la contraseña sea correcta
- Revisa que el hash esté bien generado

### Error: "Connection timeout"

- Verifica las variables de entorno de Supabase
- Revisa la conectividad a la base de datos

### Error: "JWT Secret not defined"

- Asegúrate de que `JWT_SECRET` esté configurado
- Verifica que las variables de entorno estén bien definidas

## 📝 Notas Importantes

- Los tokens JWT expiran en 24 horas
- Las contraseñas se almacenan hasheadas con bcrypt
- El API Gateway maneja la autenticación por API Key
- Esta lambda solo GENERA tokens, no los valida

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request
