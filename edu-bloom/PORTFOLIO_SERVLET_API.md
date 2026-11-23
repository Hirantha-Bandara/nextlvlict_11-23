# PortfolioServlet API Documentation

## Overview
The PortfolioServlet provides endpoints for managing portfolio data including testimonials, events, and timetables (O/L and A/L). All endpoints return JSON responses.

## Base URL
```
/PortfolioServlet
```

## HTTP Methods
- **GET** - For retrieving data
- **POST** - For saving/updating data

---

## Actions

### 1. getAllData
Retrieves all portfolio data in a single response.

**Parameters:**
- `action` (required): "getAllData"

**Request Example:**
```
GET /PortfolioServlet?action=getAllData
```

**Response:**
```json
{
  "testimonials": [
    {
      "id": 1,
      "name": "John Doe",
      "role": "Student",
      "image": "https://example.com/image.jpg",
      "text": "Great experience!"
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "Workshop",
      "description": "Short description",
      "image": "https://example.com/event.jpg",
      "date": "2024-01-15",
      "location": "Main Hall",
      "fullDescription": "Detailed description",
      "fee": "Free"
    }
  ],
  "olTimetable": [
    {
      "branch": "Colombo",
      "grade10": [
        {
          "location": "Hall A",
          "grade": "Grade 10",
          "time": "8:00 AM",
          "group": "Group 1"
        }
      ],
      "grade11": [
        {
          "location": "Hall B",
          "grade": "Grade 11",
          "time": "10:00 AM",
          "group": "Group 2"
        }
      ]
    }
  ],
  "alTimetable": [
    {
      "id": 1,
      "branch": "Colombo",
      "year": "2024",
      "type": "Revision",
      "time": "2:00 PM"
    }
  ]
}
```

---

### 2. getTestimonials
Retrieves only testimonials.

**Parameters:**
- `action` (required): "getTestimonials"

**Request Example:**
```
GET /PortfolioServlet?action=getTestimonials
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "role": "Student",
    "image": "https://example.com/image.jpg",
    "text": "Great experience!"
  }
]
```

---

### 3. getEvents
Retrieves only events.

**Parameters:**
- `action` (required): "getEvents"

**Request Example:**
```
GET /PortfolioServlet?action=getEvents
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Workshop",
    "description": "Short description",
    "image": "https://example.com/event.jpg",
    "date": "2024-01-15",
    "location": "Main Hall",
    "fullDescription": "Detailed description",
    "fee": "Free"
  }
]
```

---

### 4. getOLTimetable
Retrieves O/L timetable data grouped by branch and grade.

**Parameters:**
- `action` (required): "getOLTimetable"

**Request Example:**
```
GET /PortfolioServlet?action=getOLTimetable
```

**Response:**
```json
[
  {
    "branch": "Colombo",
    "grade10": [
      {
        "location": "Hall A",
        "grade": "Grade 10",
        "time": "8:00 AM",
        "group": "Group 1"
      }
    ],
    "grade11": [
      {
        "location": "Hall B",
        "grade": "Grade 11",
        "time": "10:00 AM",
        "group": "Group 2"
      }
    ]
  }
]
```

---

### 5. getALTimetable
Retrieves A/L timetable data.

**Parameters:**
- `action` (required): "getALTimetable"

**Request Example:**
```
GET /PortfolioServlet?action=getALTimetable
```

**Response:**
```json
[
  {
    "id": 1,
    "branch": "Colombo",
    "year": "2024",
    "type": "Revision",
    "time": "2:00 PM"
  }
]
```

---

### 6. saveTestimonials
Saves testimonials to the database. This operation clears all existing testimonials and replaces them with the new data.

**Parameters:**
- `action` (required): "saveTestimonials"
- `testimonials` (required): JSON array of TestimonialDTO objects

**Request Example:**
```
POST /PortfolioServlet
Content-Type: application/x-www-form-urlencoded

action=saveTestimonials&testimonials=[{"name":"John Doe","role":"Student","image":"https://example.com/image.jpg","text":"Great experience!"}]
```

**Request Body Format (URL-encoded):**
```
testimonials=[
  {
    "name": "John Doe",
    "role": "Student",
    "image": "https://example.com/image.jpg",
    "text": "Great experience!"
  },
  {
    "name": "Jane Smith",
    "role": "Parent",
    "image": "https://example.com/image2.jpg",
    "text": "Excellent teaching!"
  }
]
```

**TestimonialDTO Structure:**
```json
{
  "id": 1,              // Optional (auto-generated on save)
  "name": "string",     // Required: Person's name
  "role": "string",     // Required: Person's role/title
  "image": "string",    // Required: Image URL
  "text": "string"      // Required: Testimonial text
}
```

**Response:**
```json
{
  "success": true,
  "message": "Testimonials saved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

### 7. saveEvents
Saves events to the database. This operation clears all existing events and replaces them with the new data.

**Parameters:**
- `action` (required): "saveEvents"
- `events` (required): JSON array of EventDTO objects

**Request Example:**
```
POST /PortfolioServlet
Content-Type: application/x-www-form-urlencoded

action=saveEvents&events=[{"title":"Workshop","description":"Short description","image":"https://example.com/event.jpg","date":"2024-01-15","location":"Main Hall","fullDescription":"Detailed description","fee":"Free"}]
```

**Request Body Format (URL-encoded):**
```
events=[
  {
    "title": "Workshop",
    "description": "Short description",
    "image": "https://example.com/event.jpg",
    "date": "2024-01-15",
    "location": "Main Hall",
    "fullDescription": "Detailed description",
    "fee": "Free"
  }
]
```

**EventDTO Structure:**
```json
{
  "id": 1,                    // Optional (auto-generated on save)
  "title": "string",          // Required: Event title
  "description": "string",    // Required: Short description
  "image": "string",          // Required: Event image URL
  "date": "string",           // Required: Event date (YYYY-MM-DD format)
  "location": "string",       // Required: Event location
  "fullDescription": "string",// Optional: Detailed description
  "fee": "string"             // Optional: Event fee information
}
```

**Response:**
```json
{
  "success": true,
  "message": "Events saved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

### 8. saveOLTimetable
Saves O/L timetable data to the database. This operation clears all existing O/L timetable entries and replaces them with the new data.

**Parameters:**
- `action` (required): "saveOLTimetable"
- `timetableData` (required): JSON array of OLTimetableDTO objects

**Request Example:**
```
POST /PortfolioServlet
Content-Type: application/x-www-form-urlencoded

action=saveOLTimetable&timetableData=[{"branch":"Colombo","grade10":[{"location":"Hall A","time":"8:00 AM","group":"Group 1"}],"grade11":[{"location":"Hall B","time":"10:00 AM","group":"Group 2"}]}]
```

**Request Body Format (URL-encoded):**
```
timetableData=[
  {
    "branch": "Colombo",
    "grade10": [
      {
        "location": "Hall A",
        "time": "8:00 AM",
        "group": "Group 1"
      }
    ],
    "grade11": [
      {
        "location": "Hall B",
        "time": "10:00 AM",
        "group": "Group 2"
      }
    ]
  }
]
```

**OLTimetableDTO Structure:**
```json
{
  "branch": "string",                    // Required: Branch name
  "grade10": [                           // Optional: Grade 10 classes
    {
      "location": "string",              // Required: Class location
      "time": "string",                  // Required: Class time
      "group": "string"                  // Required: Class group
    }
  ],
  "grade11": [                           // Optional: Grade 11 classes
    {
      "location": "string",              // Required: Class location
      "time": "string",                  // Required: Class time
      "group": "string"                  // Required: Class group
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "O/L timetable saved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

### 9. saveALTimetable
Saves A/L timetable data to the database. This operation clears all existing A/L timetable entries and replaces them with the new data.

**Parameters:**
- `action` (required): "saveALTimetable"
- `timetableData` (required): JSON array of ALTimetableDTO objects

**Request Example:**
```
POST /PortfolioServlet
Content-Type: application/x-www-form-urlencoded

action=saveALTimetable&timetableData=[{"branch":"Colombo","year":"2024","type":"Revision","time":"2:00 PM"}]
```

**Request Body Format (URL-encoded):**
```
timetableData=[
  {
    "branch": "Colombo",
    "year": "2024",
    "type": "Revision",
    "time": "2:00 PM"
  }
]
```

**ALTimetableDTO Structure:**
```json
{
  "id": 1,              // Optional (auto-generated on save)
  "branch": "string",   // Required: Branch name
  "year": "string",     // Required: Year
  "type": "string",     // Required: Class type (e.g., "Revision", "Theory")
  "time": "string"      // Required: Class time
}
```

**Response:**
```json
{
  "success": true,
  "message": "A/L timetable saved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

### 10. uploadImage
Uploads an image (currently returns a placeholder URL).

**Parameters:**
- `action` (required): "uploadImage"

**Request Example:**
```
POST /PortfolioServlet?action=uploadImage
```

**Response:**
```json
{
  "success": true,
  "url": "https://placehold.co/400x300/3c6299/FFFFFF?text=Uploaded+Image"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

For save operations, errors include a success flag:

```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## Notes

1. **Data Replacement**: All save operations (`saveTestimonials`, `saveEvents`, `saveOLTimetable`, `saveALTimetable`) completely replace existing data with the new data. They do not perform partial updates.

2. **Display Order**: Items are automatically assigned display order based on their position in the array (0-indexed).

3. **Active Status**: All saved items are automatically marked as active (`isActive = true`).

4. **Timestamps**: All saved items automatically receive `createdAt` and `updatedAt` timestamps.

5. **Content Type**: Use `application/x-www-form-urlencoded` for POST requests with JSON parameters.

6. **JSON Encoding**: When sending JSON arrays in request parameters, ensure proper URL encoding of special characters.

7. **Image Upload**: The `uploadImage` action currently returns a placeholder URL. Integration with actual image storage (e.g., R2StorageService) may be required for production use.

---

## Example cURL Commands

### Get All Data
```bash
curl "http://localhost:8080/PortfolioServlet?action=getAllData"
```

### Save Testimonials
```bash
curl -X POST "http://localhost:8080/PortfolioServlet" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "action=saveTestimonials" \
  -d 'testimonials=[{"name":"John Doe","role":"Student","image":"https://example.com/image.jpg","text":"Great experience!"}]'
```

### Save Events
```bash
curl -X POST "http://localhost:8080/PortfolioServlet" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "action=saveEvents" \
  -d 'events=[{"title":"Workshop","description":"Short description","image":"https://example.com/event.jpg","date":"2024-01-15","location":"Main Hall","fullDescription":"Detailed description","fee":"Free"}]'
```

### Save O/L Timetable
```bash
curl -X POST "http://localhost:8080/PortfolioServlet" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "action=saveOLTimetable" \
  -d 'timetableData=[{"branch":"Colombo","grade10":[{"location":"Hall A","time":"8:00 AM","group":"Group 1"}],"grade11":[{"location":"Hall B","time":"10:00 AM","group":"Group 2"}]}]'
```

### Save A/L Timetable
```bash
curl -X POST "http://localhost:8080/PortfolioServlet" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "action=saveALTimetable" \
  -d 'timetableData=[{"branch":"Colombo","year":"2024","type":"Revision","time":"2:00 PM"}]'
```
