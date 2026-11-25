# Class Fee Management API Documentation

## Overview
The Class Fee Management API provides CRUD operations for managing class fees (grades with associated fees) on the admin side. All endpoints require admin authentication.

**Base URL:** `/ClassFeeManagement`

**Authentication:** Requires active admin session (`isAdmin` attribute must be set in HTTP session)

---

## Endpoints

### 1. Get All Class Fees
Retrieves all class fees with their associated grade details.

**Endpoint:** `GET /ClassFeeManagement?action=getAll`

**Method:** GET

**Parameters:**
- `action` (required): Must be set to `getAll`

**Response:** JSON array of class fees

**Sample Request:**
```http
GET /ClassFeeManagement?action=getAll
```

**Sample Response:**
```json
[
  {
    "id": 1,
    "name": "Grade 10",
    "fee": 5000.0,
    "is_active": 1,
    "ol_or_al_id": 1,
    "ol_or_al_name": "OL"
  },
  {
    "id": 2,
    "name": "Grade 11",
    "fee": 5500.0,
    "is_active": 1,
    "ol_or_al_id": 1,
    "ol_or_al_name": "OL"
  }
]
```

---

### 2. Get OL/AL Types
Retrieves all OL/AL types for dropdown selection (used when creating/updating class fees).

**Endpoint:** `GET /ClassFeeManagement?action=getOlAlTypes`

**Method:** GET

**Parameters:**
- `action` (required): Must be set to `getOlAlTypes`

**Response:** JSON array of OL/AL types

**Sample Request:**
```http
GET /ClassFeeManagement?action=getOlAlTypes
```

**Sample Response:**
```json
[
  {
    "id": 1,
    "name": "OL"
  },
  {
    "id": 2,
    "name": "AL"
  }
]
```

---

### 3. Create New Class Fee
Creates a new class fee (grade with associated fee amount).

**Endpoint:** `POST /ClassFeeManagement?action=save`

**Method:** POST

**Parameters:**
- `action` (required): Must be set to `save`
- `name` (required): Grade name (e.g., "Grade 10")
- `fee` (required): Fee amount as a decimal number
- `is_active` (optional): Active status (1 for active, 0 for inactive). Defaults to 1 if not provided
- `ol_or_al_id` (optional): ID of the OL/AL type (from getOlAlTypes endpoint)

**Sample Request (Form Data):**
```http
POST /ClassFeeManagement
Content-Type: application/x-www-form-urlencoded

action=save&name=Grade 10&fee=5000&is_active=1&ol_or_al_id=1
```

**Sample Request (JSON):**
```http
POST /ClassFeeManagement
Content-Type: application/json

{
  "action": "save",
  "name": "Grade 10",
  "fee": 5000,
  "is_active": 1,
  "ol_or_al_id": 1
}
```

**Sample Response (Success):**
```json
{
  "success": "Class fee created successfully"
}
```

**Sample Response (Error):**
```json
{
  "error": "Error creating class fee: [error message]"
}
```

---

### 4. Update Class Fee
Updates an existing class fee.

**Endpoint:** `POST /ClassFeeManagement?action=update`

**Method:** POST

**Parameters:**
- `action` (required): Must be set to `update`
- `id` (required): ID of the class fee to update
- `name` (required): Updated grade name
- `fee` (required): Updated fee amount
- `is_active` (optional): Updated active status
- `ol_or_al_id` (optional): Updated OL/AL type ID

**Sample Request (Form Data):**
```http
POST /ClassFeeManagement
Content-Type: application/x-www-form-urlencoded

action=update&id=1&name=Grade 10&fee=5500&is_active=1&ol_or_al_id=1
```

**Sample Request (JSON):**
```http
POST /ClassFeeManagement
Content-Type: application/json

{
  "action": "update",
  "id": 1,
  "name": "Grade 10",
  "fee": 5500,
  "is_active": 1,
  "ol_or_al_id": 1
}
```

**Sample Response (Success):**
```json
{
  "success": "Class fee updated successfully"
}
```

**Sample Response (Error - Not Found):**
```json
{
  "error": "Class fee not found"
}
```

**Sample Response (Error - Missing ID):**
```json
{
  "error": "ID parameter is required"
}
```

---

### 5. Delete Class Fee
Deletes an existing class fee.

**Endpoint:** `POST /ClassFeeManagement?action=delete`

**Method:** POST

**Parameters:**
- `action` (required): Must be set to `delete`
- `id` (required): ID of the class fee to delete

**Sample Request (Form Data):**
```http
POST /ClassFeeManagement
Content-Type: application/x-www-form-urlencoded

action=delete&id=1
```

**Sample Request (JSON):**
```http
POST /ClassFeeManagement
Content-Type: application/json

{
  "action": "delete",
  "id": 1
}
```

**Sample Response (Success):**
```json
{
  "success": "Class fee deleted successfully"
}
```

**Sample Response (Error - Not Found):**
```json
{
  "error": "Class fee not found"
}
```

**Sample Response (Error - Missing ID):**
```json
{
  "error": "ID parameter is required"
}
```

---

## Error Responses

### Unauthorized Access
If the admin is not logged in or session is invalid:

```json
{
  "error": "Unauthorized access. Admin login required."
}
```

### Invalid Action
If an invalid action parameter is provided:

```json
{
  "error": "Invalid action"
}
```

---

## cURL Examples

### Get All Class Fees
```bash
curl -X GET "http://localhost:8080/ClassFeeManagement?action=getAll" \
  -H "Cookie: JSESSIONID=<admin_session_id>"
```

### Create New Class Fee
```bash
curl -X POST "http://localhost:8080/ClassFeeManagement" \
  -H "Cookie: JSESSIONID=<admin_session_id>" \
  -d "action=save" \
  -d "name=Grade 10" \
  -d "fee=5000" \
  -d "is_active=1" \
  -d "ol_or_al_id=1"
```

### Update Class Fee
```bash
curl -X POST "http://localhost:8080/ClassFeeManagement" \
  -H "Cookie: JSESSIONID=<admin_session_id>" \
  -d "action=update" \
  -d "id=1" \
  -d "name=Grade 10" \
  -d "fee=5500" \
  -d "is_active=1" \
  -d "ol_or_al_id=1"
```

### Delete Class Fee
```bash
curl -X POST "http://localhost:8080/ClassFeeManagement" \
  -H "Cookie: JSESSIONID=<admin_session_id>" \
  -d "action=delete" \
  -d "id=1"
```

### Get OL/AL Types
```bash
curl -X GET "http://localhost:8080/ClassFeeManagement?action=getOlAlTypes" \
  -H "Cookie: JSESSIONID=<admin_session_id>"
```

---

## JavaScript/Fetch Examples

### Get All Class Fees
```javascript
fetch('/ClassFeeManagement?action=getAll', {
  method: 'GET',
  credentials: 'include' // Includes session cookies
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Create New Class Fee
```javascript
const formData = new FormData();
formData.append('action', 'save');
formData.append('name', 'Grade 10');
formData.append('fee', '5000');
formData.append('is_active', '1');
formData.append('ol_or_al_id', '1');

fetch('/ClassFeeManagement', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Update Class Fee
```javascript
const formData = new FormData();
formData.append('action', 'update');
formData.append('id', '1');
formData.append('name', 'Grade 10');
formData.append('fee', '5500');
formData.append('is_active', '1');
formData.append('ol_or_al_id', '1');

fetch('/ClassFeeManagement', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Delete Class Fee
```javascript
const formData = new FormData();
formData.append('action', 'delete');
formData.append('id', '1');

fetch('/ClassFeeManagement', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## Notes

1. **Authentication**: All endpoints require an active admin session. Make sure the admin is logged in before making requests.

2. **Data Types**: 
   - `fee` should be sent as a decimal number (e.g., 5000.00)
   - `is_active` should be 1 (active) or 0 (inactive)
   - `id` and `ol_or_al_id` should be integers

3. **Soft Delete**: The delete operation permanently removes the grade from the database. Consider using `is_active=0` for soft deactivation if needed.

4. **Dependencies**: The `ol_or_al_id` parameter references the OL/AL type table. Ensure valid IDs are used from the `getOlAlTypes` endpoint.

5. **Response Format**: All responses are in JSON format with either a `success` or `error` key.

6. **Session Management**: Admin sessions typically expire after 30 minutes of inactivity. Handle session expiration gracefully in your frontend code.
