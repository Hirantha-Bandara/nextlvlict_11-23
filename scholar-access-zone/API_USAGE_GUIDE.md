# Image Upload API - Usage Guide

This guide explains how to use the image upload endpoints from your frontend application.

## Prerequisites

- **Admin Authentication Required**: All upload/replace/delete operations require an active admin session
- **Session Management**: Login via `/AdminLogin` endpoint first to establish admin session
- **Image Requirements**: JPEG, PNG, or WebP format, max 5MB file size

## Base URL

All image upload operations use:
```
POST /ImageUploadServlet
Content-Type: multipart/form-data
```

## Authentication Flow

### 1. Login as Admin First

```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}' \
  -c cookies.txt
```

The session cookie will be saved in `cookies.txt` and used for subsequent requests.

---

## Recording Thumbnails

### Upload Recording Thumbnail

**Endpoint:** `POST /ImageUploadServlet`

**Parameters:**
- `action`: `uploadRecordingThumbnail`
- `recordingId`: Integer (ID of the recording)
- `image`: File (JPEG/PNG/WebP, max 5MB)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=uploadRecordingThumbnail" \
  -F "recordingId=123" \
  -F "image=@/path/to/thumbnail.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'uploadRecordingThumbnail');
formData.append('recordingId', '123');
formData.append('image', fileInput.files[0]);

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Thumbnail URL:', data.imageUrl);
  } else {
    console.error('Error:', data.message);
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/recordings/123/thumbnail/abc123.webp"
}
```

### Delete Recording Thumbnail

**Parameters:**
- `action`: `deleteRecordingThumbnail`
- `recordingId`: Integer

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=deleteRecordingThumbnail" \
  -F "recordingId=123"
```

**Response:**
```json
{
  "success": true,
  "message": "Thumbnail deleted successfully"
}
```

---

## Tute Cover Images

### Upload Tute Cover Image

**Parameters:**
- `action`: `uploadTuteCover`
- `tuteId`: Integer (ID of the tute)
- `image`: File (JPEG/PNG/WebP, max 5MB)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=uploadTuteCover" \
  -F "tuteId=456" \
  -F "image=@/path/to/cover.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'uploadTuteCover');
formData.append('tuteId', '456');
formData.append('image', fileInput.files[0]);

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Cover URL:', data.imageUrl);
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Cover image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/tutes/456/cover/def456.webp"
}
```

### Delete Tute Cover Image

**Parameters:**
- `action`: `deleteTuteCover`
- `tuteId`: Integer

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=deleteTuteCover" \
  -F "tuteId=456"
```

---

## Testimonial Profile Images

### Upload Testimonial Profile Image

**Parameters:**
- `action`: `uploadTestimonialImage`
- `testimonialId`: Integer (ID of the testimonial)
- `image`: File (JPEG/PNG/WebP, max 5MB)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=uploadTestimonialImage" \
  -F "testimonialId=789" \
  -F "image=@/path/to/profile.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'uploadTestimonialImage');
formData.append('testimonialId', '789');
formData.append('image', fileInput.files[0]);

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Profile URL:', data.imageUrl);
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/testimonials/789/profile/ghi789.webp"
}
```

---

## Portfolio Gallery

### Upload Gallery Image

**Parameters:**
- `action`: `uploadGalleryImage`
- `image`: File (JPEG/PNG/WebP, max 5MB)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=uploadGalleryImage" \
  -F "image=@/path/to/gallery-image.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'uploadGalleryImage');
formData.append('image', fileInput.files[0]);

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Image URL:', data.imageUrl);
    console.log('Image ID:', data.id);
    console.log('Display Order:', data.displayOrder);
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Gallery image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/gallery/jkl012.webp",
  "id": 1,
  "displayOrder": 0
}
```

### List Gallery Images

**Parameters:**
- `action`: `listGalleryImages`

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=listGalleryImages"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'listGalleryImages');

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    data.images.forEach(img => {
      console.log('ID:', img.id, 'URL:', img.imageUrl, 'Order:', img.displayOrder);
    });
  }
});
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "imageUrl": "https://cdn.nextlvlict.com/gallery/jkl012.webp",
      "displayOrder": 0
    },
    {
      "id": 2,
      "imageUrl": "https://cdn.nextlvlict.com/gallery/mno345.webp",
      "displayOrder": 1
    }
  ]
}
```

### Delete Gallery Image

**Parameters:**
- `action`: `deleteGalleryImage`
- `imageId`: Integer (ID of the gallery image)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=deleteGalleryImage" \
  -F "imageId=1"
```

### Reorder Gallery Images

**Parameters:**
- `action`: `reorderGalleryImages`
- `orderData`: JSON array of objects with `id` and `displayOrder`

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=reorderGalleryImages" \
  -F "orderData=[{\"id\":1,\"displayOrder\":0},{\"id\":2,\"displayOrder\":1},{\"id\":3,\"displayOrder\":2}]"
```

**JavaScript/Fetch Example:**
```javascript
const orderData = [
  { id: 1, displayOrder: 0 },
  { id: 2, displayOrder: 1 },
  { id: 3, displayOrder: 2 }
];

const formData = new FormData();
formData.append('action', 'reorderGalleryImages');
formData.append('orderData', JSON.stringify(orderData));

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Gallery reordered successfully');
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Gallery images reordered successfully"
}
```

---

## Branch Images

### Upload Branch Image

**Parameters:**
- `action`: `uploadBranchImage`
- `branchName`: String (name of the branch, e.g., "Colombo", "Kandy")
- `image`: File (JPEG/PNG/WebP, max 5MB)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=uploadBranchImage" \
  -F "branchName=Colombo" \
  -F "image=@/path/to/branch-image.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'uploadBranchImage');
formData.append('branchName', 'Colombo');
formData.append('image', fileInput.files[0]);

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Branch image URL:', data.imageUrl);
  }
});
```

**Response:**
```json
{
  "success": true,
  "message": "Branch image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/branches/Colombo/pqr678.webp"
}
```

### List Branch Images

**Parameters:**
- `action`: `listBranchImages`

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=listBranchImages"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('action', 'listBranchImages');

fetch('/ImageUploadServlet', {
  method: 'POST',
  credentials: 'include',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    data.images.forEach(img => {
      console.log('Branch:', img.branchName, 'URL:', img.imageUrl);
    });
  }
});
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "branchName": "Colombo",
      "imageUrl": "https://cdn.nextlvlict.com/branches/Colombo/pqr678.webp"
    },
    {
      "id": 2,
      "branchName": "Kandy",
      "imageUrl": "https://cdn.nextlvlict.com/branches/Kandy/stu901.webp"
    }
  ]
}
```

### Delete Branch Image

**Parameters:**
- `action`: `deleteBranchImage`
- `branchName`: String (name of the branch)

**cURL Example:**
```bash
curl -X POST http://localhost:8080/NextLevelICT-Backend/ImageUploadServlet \
  -b cookies.txt \
  -F "action=deleteBranchImage" \
  -F "branchName=Colombo"
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Scenarios

**Authentication Required (401):**
```json
{
  "success": false,
  "message": "Admin authentication required"
}
```

**Invalid File Type:**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
}
```

**File Size Exceeded:**
```json
{
  "success": false,
  "message": "File size exceeds maximum allowed size of 5MB"
}
```

**Entity Not Found:**
```json
{
  "success": false,
  "message": "Recording not found"
}
```

---

## React Component Example

### Recording Thumbnail Upload Component

```jsx
import React, { useState } from 'react';

function RecordingThumbnailUpload({ recordingId, currentThumbnail }) {
  const [uploading, setUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(currentThumbnail);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('action', 'uploadRecordingThumbnail');
    formData.append('recordingId', recordingId);
    formData.append('image', file);

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setThumbnailUrl(data.imageUrl);
        alert('Thumbnail uploaded successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this thumbnail?')) return;

    const formData = new FormData();
    formData.append('action', 'deleteRecordingThumbnail');
    formData.append('recordingId', recordingId);

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setThumbnailUrl(null);
        alert('Thumbnail deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="thumbnail-upload">
      <h3>Recording Thumbnail</h3>
      
      {thumbnailUrl && (
        <div className="current-thumbnail">
          <img src={thumbnailUrl} alt="Recording Thumbnail" style={{ maxWidth: '300px' }} />
          <button onClick={handleDelete} disabled={uploading}>
            Delete Thumbnail
          </button>
        </div>
      )}

      <div className="upload-section">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span>Uploading...</span>}
      </div>

      <p className="help-text">
        Accepted formats: JPEG, PNG, WebP (max 5MB)
      </p>
    </div>
  );
}

export default RecordingThumbnailUpload;
```

### Gallery Management Component

```jsx
import React, { useState, useEffect } from 'react';

function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load gallery images on mount
  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    const formData = new FormData();
    formData.append('action', 'listGalleryImages');

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('action', 'uploadGalleryImage');
    formData.append('image', file);

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        await loadGalleryImages(); // Reload gallery
        alert('Image uploaded successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const formData = new FormData();
    formData.append('action', 'deleteGalleryImage');
    formData.append('imageId', imageId);

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        await loadGalleryImages(); // Reload gallery
        alert('Image deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  const handleReorder = async (newOrder) => {
    const formData = new FormData();
    formData.append('action', 'reorderGalleryImages');
    formData.append('orderData', JSON.stringify(newOrder));

    try {
      const response = await fetch('/ImageUploadServlet', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setImages(newOrder);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Reorder failed: ' + error.message);
    }
  };

  return (
    <div className="gallery-management">
      <h2>Portfolio Gallery</h2>

      <div className="upload-section">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span>Uploading...</span>}
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.imageUrl} alt={`Gallery ${image.id}`} />
            <button onClick={() => handleDelete(image.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryManagement;
```

---

## Image Specifications Summary

| Image Type | Max Dimensions | Output Format | Max Size |
|------------|---------------|---------------|----------|
| Recording Thumbnail | 1280x720 | WebP | 5MB |
| Tute Cover | 1280x720 | WebP | 5MB |
| Testimonial Profile | 800x800 | WebP | 5MB |
| Gallery | 1920x1920 | WebP | 5MB |
| Branch Image | 1200x1200 | WebP | 5MB |

---

## Testing Checklist

- [ ] Login as admin successfully
- [ ] Upload recording thumbnail with valid image
- [ ] Upload recording thumbnail with invalid file type (should fail)
- [ ] Upload recording thumbnail with file > 5MB (should fail)
- [ ] Delete recording thumbnail
- [ ] Upload tute cover image
- [ ] Delete tute cover image
- [ ] Upload testimonial profile image
- [ ] Upload multiple gallery images
- [ ] List gallery images
- [ ] Delete gallery image
- [ ] Reorder gallery images
- [ ] Upload branch image
- [ ] List branch images
- [ ] Delete branch image
- [ ] Test without admin session (should fail with 401)

---

## Troubleshooting

### Upload fails with "Admin authentication required"
- Ensure you have logged in via `/AdminLogin` first
- Check that session cookies are being sent with requests
- Verify admin session is still active

### Upload fails with "Invalid file type"
- Ensure file is JPEG, PNG, or WebP format
- Check file extension matches actual content
- Verify file is not corrupted

### Upload fails with "File size exceeds maximum"
- Ensure file is less than 5MB
- Compress image before uploading if needed

### Image not displaying after upload
- Verify R2_PUBLIC_URL environment variable is set correctly
- Check R2 bucket has public access enabled
- Verify custom domain DNS is configured (if using custom domain)

### R2 connection error
- Verify all R2 environment variables are set
- Check R2 credentials are valid
- Verify R2 endpoint URL is correct
- Check network connectivity to R2

---

## Additional Resources

- **Complete Documentation**: See `IMAGE_UPLOAD_SYSTEM_DOCUMENTATION.md` for detailed setup instructions
- **Database Migration**: Run `database_migration_image_upload_system.sql` before using
- **Environment Setup**: Set all required environment variables before starting Tomcat
