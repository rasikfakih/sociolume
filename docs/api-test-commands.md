# API Test Commands

Comprehensive cURL commands for testing all Sociolume API routes.

> **Note:** Replace placeholder values with actual data:
> - `YOUR_CLERK_TOKEN` → Your Clerk authentication token
> - `BRAND_ID` → UUID from created brand
> - `KEYWORD_ID` → UUID from created keyword
> - `MENTION_ID` → UUID from mention record
> - `USER_ID` → User ID for assignment

---

## Base Configuration

```bash
# Base URL
BASE_URL="http://localhost:4000"

# Common headers (used across all commands)
AUTH_HEADER="Authorization: Bearer YOUR_CLERK_TOKEN"
CONTENT_JSON="Content-Type: application/json"
```

---

## Auth Routes

### GET /api/auth/me
Get current authenticated user info.

```bash
curl -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

### GET /api/auth/profile
Get current user profile with agency details.

```bash
curl -X GET "$BASE_URL/api/auth/profile" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Response Example:**
```json
{
  "profile": {
    "id": "prof_xxx",
    "clerk_id": "user_xxx",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "agency": {
    "id": "agency_xxx",
    "name": "Acme Agency",
    "role": "admin"
  }
}
```

---

## Brand Routes

### GET /api/brands
List all brands for the authenticated user's agency.

```bash
curl -X GET "$BASE_URL/api/brands" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Response Example:**
```json
{
  "brands": [
    {
      "id": "brand_xxx",
      "agency_id": "agency_xxx",
      "name": "Zara India",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/brands
Create a new brand with initial keywords.

```bash
curl -X POST "$BASE_URL/api/brands" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zara India",
    "keywords": ["zara", "fashion", "clothing"]
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Brand name |
| `keywords` | string[] | Yes | Array of keyword phrases |

**Success Response:** `201 Created`
```json
{
  "brand": {
    "id": "brand_xxx",
    "agency_id": "agency_xxx",
    "name": "Zara India",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### GET /api/brands/:id
Get a single brand with all its active keywords.

```bash
curl -X GET "$BASE_URL/api/brands/BRAND_ID" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Response Example:**
```json
{
  "brand": {
    "id": "brand_xxx",
    "agency_id": "agency_xxx",
    "name": "Zara India",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "keywords": [
    {
      "id": "keyword_xxx",
      "brand_id": "brand_xxx",
      "phrase": "zara",
      "platform": "all",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### DELETE /api/brands/:id
Soft delete a brand (sets `is_active = false`).

```bash
curl -X DELETE "$BASE_URL/api/brands/BRAND_ID" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Success Response:**
```json
{
  "success": true
}
```

---

### POST /api/brands/:id/keywords
Add a new keyword/phrase to monitor for a brand.

```bash
curl -X POST "$BASE_URL/api/brands/BRAND_ID/keywords" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phrase": "summer collection",
    "platform": "reddit"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phrase` | string | Yes | Keyword phrase to monitor |
| `platform` | string | No | Platform filter (`reddit`, `news`, `all`). Default: `all` |

**Success Response:** `201 Created`
```json
{
  "keyword": {
    "id": "keyword_xxx",
    "brand_id": "brand_xxx",
    "phrase": "summer collection",
    "platform": "reddit",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### DELETE /api/brands/:id/keywords/:keywordId
Remove a keyword (soft delete - sets `is_active = false`).

```bash
curl -X DELETE "$BASE_URL/api/brands/BRAND_ID/keywords/KEYWORD_ID" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Success Response:**
```json
{
  "success": true
}
```

---

### GET /api/brands/:id/mentions
Get mentions for a brand with pagination and filters.

```bash
curl -X GET "$BASE_URL/api/brands/BRAND_ID/mentions?status=new&platform=reddit&page=1" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status (`new`, `assigned`, `replied`, `closed`) |
| `platform` | string | No | Filter by platform (`reddit`, `news`) |
| `page` | number | No | Page number. Default: `1` |

**Response Example:**
```json
{
  "mentions": [
    {
      "id": "mention_xxx",
      "brand_id": "brand_xxx",
      "keyword_id": "keyword_xxx",
      "platform": "reddit",
      "status": "new",
      "title": "Check out Zara's summer collection!",
      "url": "https://reddit.com/r/fashion/...",
      "author": "username123",
      "assigned_to": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1,
  "page": 1,
  "totalPages": 1
}
```

---

### PATCH /api/brands/:id/mentions/:mentionId
Update a mention's status or assignment.

```bash
curl -X PATCH "$BASE_URL/api/brands/BRAND_ID/mentions/MENTION_ID" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "assigned",
    "assigned_to": "USER_ID"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | New status (`new`, `assigned`, `replied`, `closed`) |
| `assigned_to` | string | No | User ID to assign the mention to |

**Success Response:**
```json
{
  "mention": {
    "id": "mention_xxx",
    "brand_id": "brand_xxx",
    "keyword_id": "keyword_xxx",
    "platform": "reddit",
    "status": "assigned",
    "title": "Check out Zara's summer collection!",
    "url": "https://reddit.com/r/fashion/...",
    "author": "username123",
    "assigned_to": "user_xxx",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Testing Workflow Example

```bash
#!/bin/bash
# Complete testing workflow

BASE_URL="http://localhost:4000"
TOKEN="YOUR_CLERK_TOKEN"

echo "=== 1. Get Profile ==="
curl -s -X GET "$BASE_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== 2. Create Brand ==="
BRAND_RESPONSE=$(curl -s -X POST "$BASE_URL/api/brands" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Zara India", "keywords": ["zara", "fashion"]}')
echo "$BRAND_RESPONSE" | jq .
BRAND_ID=$(echo "$BRAND_RESPONSE" | jq -r '.brand.id')

echo -e "\n=== 3. Get All Brands ==="
curl -s -X GET "$BASE_URL/api/brands" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== 4. Get Single Brand ==="
curl -s -X GET "$BASE_URL/api/brands/$BRAND_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== 5. Add Keyword ==="
KEYWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/brands/$BRAND_ID/keywords" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phrase": "summer collection", "platform": "reddit"}')
echo "$KEYWORD_RESPONSE" | jq .
KEYWORD_ID=$(echo "$KEYWORD_RESPONSE" | jq -r '.keyword.id')

echo -e "\n=== 6. Delete Keyword ==="
curl -s -X DELETE "$BASE_URL/api/brands/$BRAND_ID/keywords/$KEYWORD_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n=== 7. Get Mentions ==="
curl -s -X GET "$BASE_URL/api/brands/$BRAND_ID/mentions" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== 8. Delete Brand (Soft Delete) ==="
curl -s -X DELETE "$BASE_URL/api/brands/$BRAND_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid body data |
| `401` | Unauthorized - Missing/invalid token |
| `404` | Not Found - Brand/Agency not found |

**Error Example:**
```json
{
  "error": "Brand not found"
}
```
