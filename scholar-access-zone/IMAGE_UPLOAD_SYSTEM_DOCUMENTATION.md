# Cloudflare R2 Image Upload System - Documentation

## Overview
This document describes the Cloudflare R2 media upload system implementation for the NextLevelICT backend. The system provides secure image upload, validation, optimization, and storage using Cloudflare R2 with S3-compatible API.

## Files Created

### New Java Files
1. **R2StorageService.java** - `src/main/java/com/nextlvlict/nextlvlict/service/R2StorageService.java`
   - Singleton service for Cloudflare R2 operations
   - Handles file upload, deletion, and URL generation
   - Configuration from environment variables

2. **ImageUtil.java** - `src/main/java/com/nextlvlict/nextlvlict/util/ImageUtil.java`
   - Image validation and optimization utility
   - Supports JPEG, PNG, WebP formats
   - Converts images to WebP with quality optimization
   - Size validation (max 5MB)

3. **ImageUploadServlet.java** - `src/main/java/com/nextlvlict/nextlvlict/controller/ImageUploadServlet.java`
   - Main servlet handling all image upload operations
   - Admin authentication required for all operations
   - Handles recording thumbnails, tute covers, testimonials, gallery, and branch images

### New Hibernate Entities
4. **PortfolioGalleryImage.java** - `src/main/java/com/nextlvlict/nextlvlict/hibernate/PortfolioGalleryImage.java`
   - Entity for portfolio gallery images
   - Supports display ordering and active status

5. **PortfolioBranchImage.java** - `src/main/java/com/nextlvlict/nextlvlict/hibernate/PortfolioBranchImage.java`
   - Entity for branch images
   - Unique constraint on branch name

### Modified Files
6. **Recordings.java** - Added `thumbnail_url` field
7. **Tutes.java** - Added `cover_image_url` field
8. **hibernate.cfg.xml** - Added mappings for new entities
9. **pom.xml** - Added AWS SDK and Thumbnailator dependencies

### Database Migration
10. **database_migration_image_upload_system.sql** - SQL migration script

## Environment Variables Required

The following environment variables must be set for R2 integration:

| Variable | Description | Example |
|----------|-------------|---------|
| `R2_ACCOUNT_ID` | Cloudflare R2 Account ID | `abc123xyz456` |
| `R2_ACCESS_KEY_ID` | R2 Access Key ID | `access_key_id` |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Access Key | `secret_access_key` |
| `R2_BUCKET_NAME` | R2 Bucket Name | `nextlevelict-media` |
| `R2_ENDPOINT` | R2 S3-compatible endpoint | `https://abc123xyz456.r2.cloudflarestorage.com` |
| `R2_PUBLIC_URL` | Public CDN URL for images | `https://cdn.nextlvlict.com` |

### Setting Environment Variables

**Windows (PowerShell):**
```powershell
$env:R2_ACCOUNT_ID="your_account_id"
$env:R2_ACCESS_KEY_ID="your_access_key_id"
$env:R2_SECRET_ACCESS_KEY="your_secret_access_key"
$env:R2_BUCKET_NAME="your_bucket_name"
$env:R2_ENDPOINT="https://your_account_id.r2.cloudflarestorage.com"
$env:R2_PUBLIC_URL="https://cdn.nextlvlict.com"
```

**Windows (Command Prompt):**
```cmd
set R2_ACCOUNT_ID=your_account_id
set R2_ACCESS_KEY_ID=your_access_key_id
set R2_SECRET_ACCESS_KEY=your_secret_access_key
set R2_BUCKET_NAME=your_bucket_name
set R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
set R2_PUBLIC_URL=https://cdn.nextlvlict.com
```

**Linux/Mac:**
```bash
export R2_ACCOUNT_ID=your_account_id
export R2_ACCESS_KEY_ID=your_access_key_id
export R2_SECRET_ACCESS_KEY=your_secret_access_key
export R2_BUCKET_NAME=your_bucket_name
export R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
export R2_PUBLIC_URL=https://cdn.nextlvlict.com
```

## Cloudflare R2 Setup Requirements

### 1. Create R2 Bucket
1. Log in to Cloudflare Dashboard
2. Navigate to R2 > Create Bucket
3. Choose a bucket name (e.g., `nextlevelict-media`)
4. Select region (auto is recommended)
5. Create bucket

### 2. Create API Token
1. Navigate to R2 > Manage R2 API Tokens
2. Create API Token with permissions:
   - Object Read & Write
   - List Objects
3. Copy Access Key ID and Secret Access Key

### 3. Configure Public Access (Optional)
If you want public access to images:
1. Navigate to R2 > Your Bucket > Settings
2. Enable Public Access
3. Set up custom domain (optional but recommended)

### 4. Set Up Custom Domain (Recommended)
1. Navigate to R2 > Your Bucket > Settings > Custom Domains
2. Add your custom domain (e.g., `cdn.nextlevelict.com`)
3. Update DNS records as instructed by Cloudflare
4. Use this domain as `R2_PUBLIC_URL`

## API Endpoints

All endpoints require admin authentication via session.

### Base URL
```
/ImageUploadServlet
```

### Recording Thumbnail Operations

#### Upload Recording Thumbnail
- **Action:** `uploadRecordingThumbnail`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `action`: `uploadRecordingThumbnail`
  - `recordingId`: Integer (required)
  - `image`: File (required, max 5MB, JPEG/PNG/WebP)
- **Response:**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/recordings/123/thumbnail/uuid.webp"
}
```

#### Delete Recording Thumbnail
- **Action:** `deleteRecordingThumbnail`
- **Method:** POST
- **Parameters:**
  - `action`: `deleteRecordingThumbnail`
  - `recordingId`: Integer (required)
- **Response:**
```json
{
  "success": true,
  "message": "Thumbnail deleted successfully"
}
```

### Tute Cover Operations

#### Upload Tute Cover
- **Action:** `uploadTuteCover`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `action`: `uploadTuteCover`
  - `tuteId`: Integer (required)
  - `image`: File (required, max 5MB, JPEG/PNG/WebP)
- **Response:**
```json
{
  "success": true,
  "message": "Cover image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/tutes/456/cover/uuid.webp"
}
```

#### Delete Tute Cover
- **Action:** `deleteTuteCover`
- **Method:** POST
- **Parameters:**
  - `action`: `deleteTuteCover`
  - `tuteId`: Integer (required)
- **Response:**
```json
{
  "success": true,
  "message": "Cover image deleted successfully"
}
```

### Testimonial Profile Image Operations

#### Upload Testimonial Profile Image
- **Action:** `uploadTestimonialImage`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `action`: `uploadTestimonialImage`
  - `testimonialId`: Integer (required)
  - `image`: File (required, max 5MB, JPEG/PNG/WebP)
- **Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/testimonials/789/profile/uuid.webp"
}
```

### Gallery Operations

#### Upload Gallery Image
- **Action:** `uploadGalleryImage`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `action`: `uploadGalleryImage`
  - `image`: File (required, max 5MB, JPEG/PNG/WebP)
- **Response:**
```json
{
  "success": true,
  "message": "Gallery image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/gallery/uuid.webp",
  "id": 1,
  "displayOrder": 0
}
```

#### List Gallery Images
- **Action:** `listGalleryImages`
- **Method:** GET/POST
- **Parameters:**
  - `action`: `listGalleryImages`
- **Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "imageUrl": "https://cdn.nextlvlict.com/gallery/uuid1.webp",
      "displayOrder": 0
    },
    {
      "id": 2,
      "imageUrl": "https://cdn.nextlvlict.com/gallery/uuid2.webp",
      "displayOrder": 1
    }
  ]
}
```

#### Delete Gallery Image
- **Action:** `deleteGalleryImage`
- **Method:** POST
- **Parameters:**
  - `action`: `deleteGalleryImage`
  - `imageId`: Integer (required)
- **Response:**
```json
{
  "success": true,
  "message": "Gallery image deleted successfully"
}
```

#### Reorder Gallery Images
- **Action:** `reorderGalleryImages`
- **Method:** POST
- **Parameters:**
  - `action`: `reorderGalleryImages`
  - `orderData`: JSON array (required)
- **Request Body (orderData):**
```json
[
  {"id": 1, "displayOrder": 0},
  {"id": 2, "displayOrder": 1},
  {"id": 3, "displayOrder": 2}
]
```
- **Response:**
```json
{
  "success": true,
  "message": "Gallery images reordered successfully"
}
```

### Branch Image Operations

#### Upload Branch Image
- **Action:** `uploadBranchImage`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `action`: `uploadBranchImage`
  - `branchName`: String (required)
  - `image`: File (required, max 5MB, JPEG/PNG/WebP)
- **Response:**
```json
{
  "success": true,
  "message": "Branch image uploaded successfully",
  "imageUrl": "https://cdn.nextlvlict.com/branches/Colombo/uuid.webp"
}
```

#### Delete Branch Image
- **Action:** `deleteBranchImage`
- **Method:** POST
- **Parameters:**
  - `action`: `deleteBranchImage`
  - `branchName`: String (required)
- **Response:**
```json
{
  "success": true,
  "message": "Branch image deleted successfully"
}
```

#### List Branch Images
- **Action:** `listBranchImages`
- **Method:** GET/POST
- **Parameters:**
  - `action`: `listBranchImages`
- **Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "branchName": "Colombo",
      "imageUrl": "https://cdn.nextlvlict.com/branches/Colombo/uuid.webp"
    },
    {
      "id": 2,
      "branchName": "Kandy",
      "imageUrl": "https://cdn.nextlvlict.com/branches/Kandy/uuid.webp"
    }
  ]
}
```

## Image Specifications

### Allowed Formats
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)

### File Size Limits
- Maximum: 5 MB per image
- Servlet configuration: 5 MB max file size, 10 MB max request size

### Image Dimensions (After Optimization)
- **Recording Thumbnail:** Max 1280x720 pixels
- **Tute Cover:** Max 1280x720 pixels
- **Testimonial Profile:** Max 800x800 pixels
- **Gallery:** Max 1920x1920 pixels (longest side)
- **Branch Image:** Max 1200x1200 pixels

### Output Format
- All images are converted to WebP format
- Quality: 85% (0.85)
- Aspect ratio is preserved

### Object Key Structure
```
recordings/{recordingId}/thumbnail/{uuid}.webp
tutes/{tuteId}/cover/{uuid}.webp
testimonials/{testimonialId}/profile/{uuid}.webp
gallery/{uuid}.webp
branches/{encoded-branch-name}/{uuid}.webp
```

## Security Measures

### Authentication
- All upload/replace/delete operations require admin authentication
- Uses existing `AuthorizationUtil.requireAdminAuthentication()`
- Session-based authentication

### Validation
- File size validation (max 5MB)
- MIME type validation (JPEG, PNG, WebP only)
- Actual image content validation (prevents fake extensions)
- Image dimension validation (10x10 to 10000x10000)
- Path traversal prevention (UUID-based object keys)

### R2 Security
- Credentials never exposed to frontend
- Credentials loaded from environment variables only
- No hardcoded credentials in source code
- S3-compatible API with secure endpoint

### Database Security
- Entity existence verification before operations
- Transaction rollback on failure
- R2 cleanup on database failure

## Database Migration

Run the migration script:
```bash
mysql -u root -p nextlevelict_sp < database_migration_image_upload_system.sql
```

### Migration Details
- Adds `thumbnail_url` to `recordings` table
- Adds `cover_image_url` to `tutes` table
- Creates `portfolio_gallery_images` table
- Creates `portfolio_branch_images` table
- Adds appropriate indexes

## Maven Dependencies Added

```xml
<!-- AWS SDK for Java 2.x S3 Client -->
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.21.1</version>
</dependency>

<!-- Thumbnailator for image processing -->
<dependency>
    <groupId>net.coobird</groupId>
    <artifactId>thumbnailator</artifactId>
    <version>0.4.20</version>
</dependency>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error scenarios:
- Authentication required (401)
- Invalid file type
- File size exceeded
- Invalid entity ID
- R2 upload failure
- Database failure

## Testing Recommendations

### Manual Testing Steps

1. **Set environment variables**
2. **Run database migration**
3. **Build project:** `mvn clean package`
4. **Deploy to Tomcat**
5. **Login as admin**
6. **Test each endpoint with valid images**
7. **Test with invalid images (wrong format, too large)**
8. **Test unauthorized access (without admin session)**
9. **Test replace operations (upload new image)**
10. **Test delete operations**
11. **Test gallery reordering**

### Test Cases

#### Recording Thumbnail
- Upload valid thumbnail
- Upload invalid file type
- Upload file > 5MB
- Replace existing thumbnail
- Delete thumbnail
- Upload without authentication

#### Tute Cover
- Upload valid cover image
- Upload invalid file type
- Replace existing cover
- Delete cover

#### Testimonial Profile
- Upload valid profile image
- Replace existing image
- Test with various image sizes

#### Gallery
- Upload single image
- Upload multiple images
- List images
- Delete image
- Reorder images
- Test display order

#### Branch Image
- Upload branch image
- Upload image for same branch (replace)
- List branch images
- Delete branch image
- Test with special characters in branch name

## Existing Functionality Preservation

The implementation does NOT modify or break:
- YouTube recording functionality
- Google Drive links
- Tute download links
- Portfolio testimonials (reuses existing image field)
- Portfolio events (preserved)
- O/L timetable
- A/L timetable
- Existing Admin CRUD operations
- Student authentication
- Existing API response formats

## Troubleshooting

### R2 Connection Issues
- Verify environment variables are set
- Check R2 credentials are valid
- Verify endpoint URL is correct
- Check network connectivity
- Review Tomcat logs for detailed errors

### Image Upload Failures
- Verify file size < 5MB
- Check image format (JPEG/PNG/WebP)
- Verify image is not corrupted
- Check R2 bucket permissions
- Review servlet logs for validation errors

### Database Issues
- Verify migration was run successfully
- Check Hibernate configuration
- Verify database connection
- Review entity mappings in hibernate.cfg.xml

## Support

For issues or questions:
1. Check Tomcat logs: `catalina.out`
2. Review application logs
3. Verify environment variables
4. Check R2 bucket configuration
5. Test R2 credentials manually
