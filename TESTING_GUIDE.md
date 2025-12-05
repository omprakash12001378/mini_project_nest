# API Testing Guide

This guide provides comprehensive examples for testing all endpoints of the Pets Management API.

## Prerequisites

1. MySQL is running (see MYSQL_SETUP.md)
2. Application is running: `npm run start:dev`
3. API is accessible at: `http://localhost:3000`

## Testing Tools

You can use any of these tools:
- **curl** (command line)
- **Postman** (import `postman-collection.json`)
- **Thunder Client** (VS Code extension)
- **Insomnia**
- **HTTPie**

## Test Scenarios

### 1. Create a Pet (Success) ✅

**Request:**
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

**Expected Response (201):**
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

**Console Output:**
```
[PetsAPI] POST /pets at 18:20:47
```

---

### 2. Create Multiple Pets

Create a cat:
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Whiskers",
    "species": "cat",
    "age": 3
  }'
```

Create a bird:
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Tweety",
    "species": "bird",
    "age": 2
  }'
```

---

### 3. Get All Pets ✅

**Request:**
```bash
curl http://localhost:3000/pets
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Buddy",
      "species": "dog",
      "age": 5,
      "createdAt": "2025-12-05T18:20:47.123Z",
      "updatedAt": "2025-12-05T18:20:47.123Z"
    },
    {
      "id": 2,
      "name": "Whiskers",
      "species": "cat",
      "age": 3,
      "createdAt": "2025-12-05T18:21:15.456Z",
      "updatedAt": "2025-12-05T18:21:15.456Z"
    }
  ],
  "duration": "8ms"
}
```

---

### 4. Get Single Pet ✅

**Request:**
```bash
curl http://localhost:3000/pets/1
```

**Expected Response (200):**
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
  "duration": "5ms"
}
```

---

### 5. Update a Pet (Success) ✅

**Request:**
```bash
curl -X PATCH http://localhost:3000/pets/1 \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "age": 6
  }'
```

**Expected Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Buddy",
    "species": "dog",
    "age": 6,
    "createdAt": "2025-12-05T18:20:47.123Z",
    "updatedAt": "2025-12-05T18:25:30.789Z"
  },
  "duration": "12ms"
}
```

---

### 6. Delete a Pet (Success) ✅

**Request:**
```bash
curl -X DELETE http://localhost:3000/pets/1 \
  -H "x-staff: true"
```

**Expected Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Buddy",
    "species": "dog",
    "age": 6,
    "createdAt": "2025-12-05T18:20:47.123Z",
    "updatedAt": "2025-12-05T18:25:30.789Z"
  },
  "duration": "10ms"
}
```

---

## Error Scenarios

### 7. Missing Staff Header ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "dog",
    "age": 3
  }'
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Staff authorization required. Include x-staff: true header",
  "error": "Unauthorized"
}
```

**What's happening:**
- StaffGuard is blocking the request
- POST endpoint requires `x-staff: true` header

---

### 8. Invalid Age (Too High) ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Charlie",
    "species": "bird",
    "age": 35
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Age must be between 0 and 30",
  "error": "Bad Request"
}
```

**What's happening:**
- AgeValidationPipe is rejecting the value
- Age must be 0-30

---

### 9. Invalid Age (Negative) ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Luna",
    "species": "cat",
    "age": -5
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Age must be between 0 and 30",
  "error": "Bad Request"
}
```

---

### 10. Invalid Species ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Fluffy",
    "species": "hamster",
    "age": 2
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Species must be one of: dog, cat, bird",
  "error": "Bad Request"
}
```

**What's happening:**
- SpeciesTransformPipe is rejecting the value
- Only "dog", "cat", "bird" are allowed

---

### 11. Species Case Transformation ✅

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Rex",
    "species": "DOG",
    "age": 4
  }'
```

**Expected Response (201):**
```json
{
  "data": {
    "id": 3,
    "name": "Rex",
    "species": "dog",
    "age": 4,
    "createdAt": "2025-12-05T18:30:00.000Z",
    "updatedAt": "2025-12-05T18:30:00.000Z"
  },
  "duration": "14ms"
}
```

**What's happening:**
- SpeciesTransformPipe normalized "DOG" to "dog"
- This demonstrates the transformation capability

---

### 12. Name Too Short ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "A",
    "species": "cat",
    "age": 2
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": [
    "Name must be at least 2 characters long"
  ],
  "error": "Bad Request"
}
```

**What's happening:**
- ValidationPipe (class-validator) is rejecting the value
- Name must be at least 2 characters

---

### 13. Missing Required Fields ❌

**Request:**
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -H "x-staff: true" \
  -d '{
    "name": "Shadow"
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": [
    "species should not be empty",
    "species must be a string",
    "Species must be dog, cat, or bird",
    "age must not be greater than 30",
    "age must not be less than 0",
    "age must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

---

### 14. Pet Not Found ❌

**Request:**
```bash
curl http://localhost:3000/pets/999
```

**Expected Response (404):**
```json
{
  "error": "Pet Not Found",
  "timestamp": "2025-12-05T18:35:00.123Z",
  "path": "/pets/999"
}
```

**What's happening:**
- PetNotFoundFilter is catching the NotFoundException
- Custom error format is returned

---

### 15. Invalid ID Format ❌

**Request:**
```bash
curl http://localhost:3000/pets/abc
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

**What's happening:**
- ParseIntPipe is validating the ID parameter
- ID must be a valid integer

---

## PowerShell Testing (Windows)

If you're using PowerShell, use `Invoke-WebRequest`:

### Create Pet:
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-staff" = "true"
}

$body = @{
    name = "Buddy"
    species = "dog"
    age = 5
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/pets" -Method POST -Headers $headers -Body $body
```

### Get All Pets:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/pets" -Method GET
```

---

## Verification Checklist

Test each component:

- [ ] **Middleware**: Check console for `[PetsAPI]` logs
- [ ] **Guard**: Test with/without `x-staff` header
- [ ] **Pipes**: Test age validation (0-30) and species transformation
- [ ] **Interceptor**: Verify `duration` field in all responses
- [ ] **Filter**: Test pet not found error format
- [ ] **Service**: CRUD operations work correctly
- [ ] **Controller**: All endpoints respond correctly

---

## Expected Console Output

When running the tests, you should see logs like:

```
[PetsAPI] POST /pets at 18:20:47
[PetsAPI] GET /pets at 18:21:00
[PetsAPI] GET /pets/1 at 18:21:15
[PetsAPI] PATCH /pets/1 at 18:22:30
[PetsAPI] DELETE /pets/1 at 18:23:45
```

---

## Performance Testing

All responses include timing information:

```json
{
  "data": { ... },
  "duration": "8ms"
}
```

Typical response times:
- GET all: 5-15ms
- GET single: 3-8ms
- POST: 10-20ms
- PATCH: 8-15ms
- DELETE: 8-15ms

---

## Next Steps

1. Import `postman-collection.json` into Postman for easier testing
2. Try all error scenarios to understand validation
3. Check MySQL Workbench to see the data
4. Experiment with different values
5. Review console logs to see middleware in action

---

## Troubleshooting

### "Cannot connect to server"
- Make sure the app is running: `npm run start:dev`
- Check the port is 3000

### "Connection to MySQL failed"
- See MYSQL_SETUP.md
- Verify MySQL is running

### "Validation errors"
- Check the request body format
- Ensure all required fields are present
- Verify data types match the schema

### "Unauthorized"
- Add `x-staff: true` header for POST, PATCH, DELETE
- Check header spelling and case
