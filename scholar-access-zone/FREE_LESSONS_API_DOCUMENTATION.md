# Free Lessons API Documentation

## Overview
The Free Lessons feature enables authenticated admins to manage YouTube video lessons displayed on the public Portfolio section. This implementation follows the existing NextLevelICT backend architecture using Hibernate ORM, session-based authentication, and the PortfolioServlet pattern.

## Database Migration

### SQL Migration Script
Run the following SQL script to create the `free_lessons` table:

```sql
-- File: database_migration_free_lessons.sql
CREATE TABLE IF NOT EXISTS free_lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_label VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### How to Run the Migration
```bash
mysql -u root -p nextlevelict_sp < database_migration_free_lessons.sql
```

## API Endpoints

All endpoints are served through the `PortfolioServlet` at:
```
/PortfolioServlet
```

### 1. GET Free Lessons (Public)
**Endpoint:** `GET /PortfolioServlet?action=getFreeLessons`  
**Authentication:** None required (public endpoint)  
**Description:** Retrieves all active free lessons ordered by display_order ASC

**Success Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "id": 1,
      "unitLabel": "UNIT 02",
      "title": "Data Representation — Number Systems",
      "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      "displayOrder": 1
    },
    {
      "id": 2,
      "unitLabel": "UNIT 03",
      "title": "Binary Arithmetic",
      "youtubeUrl": "https://www.youtube.com/watch?v=YYYYYYYYYYY",
      "displayOrder": 2
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error retrieving free lessons"
}
```

---

### 2. Save Free Lessons (Admin - Create/Replace All)
**Endpoint:** `POST /PortfolioServlet?action=saveFreeLessons`  
**Authentication:** Admin authentication required  
**Description:** Replaces all existing free lessons with the provided list. This follows the existing Portfolio pattern used for testimonials and events.

**Request Parameters:**
- `lessons` (JSON string): Array of FreeLessonDTO objects

**Request Body Example:**
```json
{
  "lessons": [
    {
      "unitLabel": "UNIT 02",
      "title": "Data Representation — Number Systems",
      "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      "displayOrder": 1
    },
    {
      "unitLabel": "UNIT 03",
      "title": "Binary Arithmetic",
      "youtubeUrl": "https://youtu.be/YYYYYYYYYYY",
      "displayOrder": 2
    },
    {
      "unitLabel": "UNIT 04",
      "title": "Logic Gates",
      "youtubeUrl": "https://www.youtube.com/embed/ZZZZZZZZZZZ",
      "displayOrder": 3
    }
  ]
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Free lessons saved successfully"
}
```

**Error Responses:**

Unauthenticated:
```json
{
  "success": false,
  "message": "Admin authentication required"
}
```

Validation Error:
```json
{
  "success": false,
  "error": "Unit label is required"
}
```

---

### 3. Update Free Lesson (Admin)
**Endpoint:** `POST /PortfolioServlet?action=updateFreeLesson`  
**Authentication:** Admin authentication required  
**Description:** Updates an existing free lesson by ID

**Request Parameters:**
- `lesson` (JSON string): FreeLessonDTO object with id

**Request Body Example:**
```json
{
  "lesson": {
    "id": 1,
    "unitLabel": "UNIT 02",
    "title": "Data Representation — Number Systems (Updated)",
    "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    "displayOrder": 1
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "lesson": {
    "id": 1,
    "unitLabel": "UNIT 02",
    "title": "Data Representation — Number Systems (Updated)",
    "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    "displayOrder": 1
  }
}
```

**Error Responses:**

Not Found:
```json
{
  "success": false,
  "error": "Free lesson not found"
}
```

Validation Error:
```json
{
  "success": false,
  "error": "Invalid YouTube URL. Supported formats: https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID, https://www.youtube.com/embed/VIDEO_ID"
}
```

---

### 4. Delete Free Lesson (Admin)
**Endpoint:** `POST /PortfolioServlet?action=deleteFreeLesson`  
**Authentication:** Admin authentication required  
**Description:** Deletes a free lesson by ID

**Request Parameters:**
- `id` (integer): The ID of the lesson to delete

**Request Example:**
```
POST /PortfolioServlet?action=deleteFreeLesson&id=1
```

**Success Response:**
```json
{
  "success": true,
  "message": "Free lesson deleted successfully"
}
```

**Error Responses:**

Not Found:
```json
{
  "success": false,
  "error": "Free lesson not found"
}
```

Invalid ID:
```json
{
  "success": false,
  "error": "Invalid lesson ID"
}
```

---

## Data Model

### FreeLesson Entity
**Table:** `free_lessons`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| unit_label | VARCHAR(100) | NOT NULL | Unit label (e.g., "UNIT 02") |
| title | VARCHAR(255) | NOT NULL | Lesson title |
| youtube_url | VARCHAR(500) | NOT NULL | YouTube video URL |
| display_order | INT | NOT NULL | Display order for sorting |
| is_active | TINYINT | DEFAULT 1 | Active status (1=active, 0=inactive) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### FreeLessonDTO
```java
public static class FreeLessonDTO {
    private int id;
    private String unitLabel;
    private String title;
    private String youtubeUrl;
    private int displayOrder;
    // getters and setters
}
```

---

## Validation Rules

### Unit Label
- **Required:** Yes
- **Max Length:** 100 characters
- **Validation:** Cannot be empty or null

### Title
- **Required:** Yes
- **Max Length:** 255 characters
- **Validation:** Cannot be empty or null

### YouTube URL
- **Required:** Yes
- **Max Length:** 500 characters
- **Validation:** Must be a valid YouTube URL
- **Supported Formats:**
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
- **Normalization:** URLs are automatically normalized to the standard watch format

### Display Order
- **Required:** Yes
- **Type:** Integer
- **Validation:** Must be a positive integer (> 0)

---

## Authentication

Admin endpoints use the existing session-based authentication via `AuthorizationUtil`:
- Checks for `isAdmin` session attribute
- Returns 401 Unauthorized if not authenticated
- Uses the same authentication mechanism as other Portfolio admin endpoints

---

## Files Created/Modified

### Created Files:
1. `src/main/java/com/nextlvlict/nextlvlict/hibernate/FreeLesson.java` - Hibernate entity
2. `src/main/java/com/nextlvlict/nextlvlict/util/YouTubeUtil.java` - YouTube URL validation utility
3. `database_migration_free_lessons.sql` - Database migration script
4. `FREE_LESSONS_API_DOCUMENTATION.md` - This documentation file

### Modified Files:
1. `src/main/java/com/nextlvlict/nextlvlict/hibernate/HibernateUtil.java` - Added FreeLesson entity mapping
2. `src/main/resources/hibernate.cfg.xml` - Added FreeLesson mapping
3. `src/main/java/com/nextlvlict/nextlvlict/controller/PortfolioServlet.java` - Added FreeLesson CRUD methods and DTO

---

## Implementation Notes

1. **Architecture Consistency:** The implementation follows the existing PortfolioServlet pattern used for testimonials and events, using the same action-based routing and response format.

2. **Database Transactions:** All write operations use Hibernate transactions with proper rollback on error.

3. **URL Normalization:** YouTube URLs are automatically normalized to the standard `https://www.youtube.com/watch?v=VIDEO_ID` format before storage.

4. **Display Order:** Lessons are always returned ordered by `display_order ASC` to ensure consistent frontend display.

5. **Soft Delete:** The implementation uses `is_active` flag for soft deletion capability, though the current delete endpoint performs hard delete. This can be extended if needed.

6. **Error Handling:** All endpoints return consistent JSON error responses without exposing Java stack traces.

7. **Backward Compatibility:** Existing Portfolio functionality (testimonials, events, timetables) remains unchanged and unaffected.

---

## Testing Checklist

- [ ] Run database migration script
- [ ] Test GET /PortfolioServlet?action=getFreeLessons (public access)
- [ ] Test POST /PortfolioServlet?action=saveFreeLessons (admin, authenticated)
- [ ] Test POST /PortfolioServlet?action=updateFreeLesson (admin, authenticated)
- [ ] Test POST /PortfolioServlet?action=deleteFreeLesson (admin, authenticated)
- [ ] Test validation: empty unitLabel
- [ ] Test validation: empty title
- [ ] Test validation: empty youtubeUrl
- [ ] Test validation: invalid YouTube URL
- [ ] Test validation: invalid displayOrder (negative or zero)
- [ ] Test authentication: unauthenticated admin request
- [ ] Test multiple lessons ordered correctly
- [ ] Verify existing Portfolio APIs still work
- [ ] Verify existing Event functionality still works
