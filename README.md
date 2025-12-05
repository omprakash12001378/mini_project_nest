# Pets Management API - NestJS Mini Project

A complete RESTful API for managing pets in an animal shelter, demonstrating all core NestJS concepts including modules, controllers, services, middleware, pipes, guards, interceptors, and exception filters.

## 🏗️ Architecture Overview

This project demonstrates the complete NestJS request lifecycle:

```
Request → Middleware → Guard → Interceptor (before) → Pipe → Controller → Service → Controller → Interceptor (after) → Exception Filter → Response
```

## 📋 Features

### Entity: Pet
- **id**: Auto-generated integer (MySQL AUTO_INCREMENT)
- **name**: String (minimum 2 characters)
- **species**: Enum ("dog" | "cat" | "bird")
- **age**: Number (0-30)
- **createdAt**: Timestamp (auto-generated)
- **updatedAt**: Timestamp (auto-updated)

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/pets` | Get all pets | No |
| GET | `/pets/:id` | Get single pet | No |
| POST | `/pets` | Create new pet | Yes (x-staff: true) |
| PATCH | `/pets/:id` | Update pet | Yes (x-staff: true) |
| DELETE | `/pets/:id` | Delete pet | Yes (x-staff: true) |

## 🛠️ Technology Stack

- **Framework**: NestJS 11
- **Database**: MySQL 8.0 (via TypeORM)
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Runtime**: Node.js
- **Language**: TypeScript

## 📦 Project Structure

```
src/
├── pets/
│   ├── dto/
│   │   ├── create-pet.dto.ts       # DTO for creating pets
│   │   └── update-pet.dto.ts       # DTO for updating pets
│   ├── entities/
│   │   └── pet.entity.ts           # TypeORM entity
│   ├── pipes/
│   │   ├── age-validation.pipe.ts  # Custom age validation
│   │   └── species-transform.pipe.ts # Species normalization
│   ├── guards/
│   │   └── staff.guard.ts          # Staff authorization
│   ├── filters/
│   │   └── pet-not-found.filter.ts # Custom exception handling
│   ├── interceptors/
│   │   └── timing.interceptor.ts   # Response timing
│   ├── middleware/
│   │   └── logger.middleware.ts    # Request logging
│   ├── pets.controller.ts          # Route handlers
│   ├── pets.service.ts             # Business logic
│   └── pets.module.ts              # Module configuration
├── app.module.ts
└── main.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start MySQL using Docker**
```bash
docker compose up -d
```

This will start MySQL on `localhost:3306` with:
- Username: `pets_user`
- Password: `password123`
- Database: `pets_shelter`

For detailed setup instructions, see [MYSQL_SETUP.md](MYSQL_SETUP.md)

3. **Start the application**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 🧪 Testing the API

### 1. Create a Pet (Requires Staff Header)

```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Buddy",
    "species": "dog",
    "age": 5
  }'
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Buddy",
    "species": "dog",
    "age": 5,
    "createdAt": "2025-12-05T18:20:47.123Z",
    "updatedAt": "2025-12-05T18:20:47.123Z"
  },
  "duration": "15ms"
}
```

### 2. Get All Pets

```bash
curl http://localhost:3000/pets
```

### 3. Get Single Pet

```bash
curl http://localhost:3000/pets/1
```

### 4. Update a Pet (Requires Staff Header)

```bash
curl -X PATCH http://localhost:3000/pets/1 \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "age": 6
  }'
```

### 5. Delete a Pet (Requires Staff Header)

```bash
curl -X DELETE http://localhost:3000/pets/1 \
  -H "x-staff: true"
```

## 🔒 NestJS Components Explained

### 1. **Module** (`pets.module.ts`)
- Organizes the application structure
- Registers TypeORM entity
- Applies middleware to all routes

### 2. **Controller** (`pets.controller.ts`)
- Handles HTTP requests
- Defines route endpoints
- Applies decorators for guards, filters, and interceptors
- Uses ParseIntPipe for ID validation

### 3. **Service** (`pets.service.ts`)
- Contains business logic
- Interacts with MySQL via TypeORM Repository
- Throws appropriate exceptions

### 4. **Middleware** (`logger.middleware.ts`)
- Logs every incoming request
- Format: `[PetsAPI] GET /pets at 14:33:12`
- Applied to all routes in PetsModule

### 5. **Pipes**

#### a. **AgeValidationPipe**
- Validates age is a number
- Ensures age is between 0 and 30
- Throws `BadRequestException` if invalid

#### b. **SpeciesTransformPipe**
- Normalizes species to lowercase
- Validates against allowed values: dog, cat, bird
- Throws `BadRequestException` if invalid

### 6. **Guard** (`staff.guard.ts`)
- Protects modification endpoints (POST, PATCH, DELETE)
- Requires `x-staff: true` header
- Throws `UnauthorizedException` if header missing

### 7. **Interceptor** (`timing.interceptor.ts`)
- Measures request duration
- Wraps response in format:
```json
{
  "data": { ...originalData },
  "duration": "8ms"
}
```

### 8. **Exception Filter** (`pet-not-found.filter.ts`)
- Catches `NotFoundException` with "Pet not found" message
- Returns custom formatted response:
```json
{
  "error": "Pet Not Found",
  "timestamp": "2025-12-05T18:20:47.123Z",
  "path": "/pets/507f1f77bcf86cd799439011"
}
```

## 🔍 Request Lifecycle Example

When you make a POST request to create a pet:

1. **Middleware**: Logs `[PetsAPI] POST /pets at 18:20:47`
2. **Guard**: Checks for `x-staff: true` header
3. **Interceptor (Before)**: Records start time
4. **Pipes**: 
   - Validates DTO with class-validator
   - Validates age (0-30)
   - Transforms species to lowercase
5. **Controller**: Receives validated data
6. **Service**: Saves to MySQL via TypeORM
7. **Controller**: Returns created pet
8. **Interceptor (After)**: Adds duration to response
9. **Response**: Sent to client

## ⚠️ Error Handling Examples

### Missing Staff Header
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{"name": "Max", "species": "dog", "age": 3}'
```

**Response (401):**
```json
{
  "statusCode": 401,
  "message": "Staff authorization required. Include x-staff: true header"
}
```

### Invalid Age
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{"name": "Max", "species": "dog", "age": 35}'
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Age must be between 0 and 30"
}
```

### Invalid Species
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{"name": "Max", "species": "hamster", "age": 2}'
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Species must be one of: dog, cat, bird"
}
```

### Pet Not Found
```bash
curl http://localhost:3000/pets/999
```

**Response (404):**
```json
{
  "error": "Pet Not Found",
  "timestamp": "2025-12-05T18:20:47.123Z",
  "path": "/pets/999"
}
```

## 🧹 Cleanup

To stop and remove the MySQL container:

```bash
docker compose down

# To also remove the data volume
docker compose down -v
```

## 📚 Learning Outcomes

By completing this project, you've learned:

✅ How to structure a NestJS application with modules  
✅ Creating controllers with proper route handlers  
✅ Implementing services for business logic  
✅ Using MySQL with TypeORM in NestJS  
✅ Creating and applying custom pipes for validation  
✅ Implementing guards for authorization  
✅ Building exception filters for custom error handling  
✅ Using interceptors to transform responses  
✅ Applying middleware for logging  
✅ Understanding the complete NestJS request lifecycle  

## 🎯 Assignment Checklist

- [x] PetsModule with proper structure
- [x] Full CRUD operations (GET, POST, PATCH, DELETE)
- [x] MySQL integration with Docker
- [x] StaffGuard for authorization
- [x] AgeValidationPipe (0-30 validation)
- [x] SpeciesTransformPipe (lowercase + validation)
- [x] PetNotFoundFilter for custom error responses
- [x] LoggerMiddleware for request logging
- [x] TimingInterceptor for response timing
- [x] Proper DTOs with validation
- [x] Complete documentation

## 📝 Notes

- All modification endpoints (POST, PATCH, DELETE) require `x-staff: true` header
- Species values are automatically normalized to lowercase
- Age must be between 0 and 30
- Pet names must be at least 2 characters
- All responses include timing information
- All requests are logged to console

## 🤝 Contributing

This is an educational project. Feel free to extend it with additional features like:
- Authentication with JWT
- Pagination for GET /pets
- Search and filtering
- File uploads for pet photos
- Unit and E2E tests

## 📄 License

This project is for educational purposes.
