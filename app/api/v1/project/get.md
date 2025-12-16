# API Documentation: Get Projects

## V1_PROJECT_GET - Fetch a list of Projects

This endpoint allows an authenticated user to retrieve a paginated list of projects, filtered according to various query parameters. Access is restricted to projects the user is a current member of.

* **Method:** `GET`
* **Path:** `/api/v1/project`
* **With Origin:** `https://tusktask.dimasfahmi.pro/api/v1/project`

-----

## Security & Access Control

| Feature | Requirement | Notes |
| :--- | :--- | :--- |
| **Authentication** | **Required** | A valid session token must be provided. Returns `401 Unauthorized` if the session is invalid. |
| **Rate Limiting** | Strict Policy (50 requests/10s) | Implemented based on the client's IP address. Returns `429 Too Many Requests` if the limit is exceeded. |
| **Authorization** | **Membership Scoped** | Users can **only** retrieve projects where they have an active membership in the `projectMembership` table. |

-----

## Request Parameters (Query)

All parameters are passed as URL query string parameters.

### Filtering Parameters

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `id=uuid-123` | Filter by a specific Project ID (UUID). |
| `name` | `string` | `name=app launch` | Performs a **Full-Text Search** on the project name. |
| `isPinned` | `string`,`boolean` | `isPinned=true` | Filter by pinned status (`"true"` or `"false"`). |
| `isArchived` | `string`,`boolean` | `isArchived=false` | Filter by archived status (`"true"` or `"false"`). |
| `isDeleted` | `string`,`boolean` | `isDeleted=yes` | **Default:** Projects with `deletedAt` are excluded. Set to `"true"` to show only deleted projects. |
| `createdById` | `string` | `createdById=user-x` | Filter projects created by a specific user. |
| `ownerId` | `string` | `ownerId=user-y` | Filter projects owned by a specific user. |
| `createdAtGt` | `Date` (Coerced) | `createdAtGt=2024-01-01` | Filter projects created after a specific date. |
| `createdAtLt` | `Date` (Coerced) | `createdAtLt=2024-12-31` | Filter projects created before a specific date. |
| `updatedAtGt` | `Date` (Coerced) | `updatedAtGt=2024-01-01` | Filter projects updated after a specific date. |
| `updatedAtLt` | `Date` (Coerced) | `updatedAtLt=2024-12-31` | Filter projects updated before a specific date. |

### Pagination Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | `1` | The current page number for pagination. 20 items/page. |

-----

## Successful Response (200 OK)

The endpoint returns a standard paginated response object containing project details, along with relationship data embedded within each project record.

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | `string` | `record_fetched` |
| `message` | `string` | `Success` |
| `status` | `number` | `200` |
| `result` | `object` | The container for the paginated results. |

### Result Object Structure

| Field | Type | Description |
| :--- | :--- | :--- |
| `page` | `number` | The current page number requested. |
| `totalPages` | `number` | The total number of pages available. |
| `totalResults` | `number` | The total number of records matching the filter criteria. |
| `result` | `Array<ExtendedProjectType>` | The array of project objects for the current page. |

### Example Project Structure (in `result`)

Each project object includes relational data (memberships and member details) to avoid additional lookups, fetched using Drizzle's `with` clause.

```json
{
  "id": "uuid-for-project",
  "name": "New App Launch",
  // ... other project fields
  "memberships": [
    {
      // ... membership fields
      "member": {
        "id": "user-x",
        "name": "John Doe",
        "username": "johndoe",
        "image": "..."
      }
    }
  ]
}
```

-----

## ❌ Error Responses

| Status Code | Code | Description |
| :--- | :--- | :--- |
| **400** | `bad_request` | Invalid query parameters (e.g., failed Zod schema validation). |
| **400** | `invalid_session` | User is not authenticated or session expired. |
| **429** | `too_many_requests` | Rate limit exceeded for the client IP address. |
| **500** | `unknown_error` | An unexpected error occurred during database operations (e.g., connection issue). |