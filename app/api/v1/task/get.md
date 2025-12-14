# API Documentation: Get Tasks

## V1\_TASK\_GET - Fetch a list of Tasks

This endpoint allows an authenticated user to retrieve a paginated list of tasks, filtered and sorted according to various query parameters. Access is restricted to tasks belonging to projects the user is a current member of.

  * **Method:** `GET`
  * **Path:** `/api/v1/task` 

-----

## Security & Access Control

| Feature | Requirement | Notes |
| :--- | :--- | :--- |
| **Authentication** | **Required** | A valid session token must be provided. Returns `401 Unauthorized` if the session is invalid. |
| **Rate Limiting** | Strict Policy (5 requests/10s) | Implemented based on the client's IP address. Returns `429 Too Many Requests` if the limit is exceeded. |
| **Authorization** | **Membership Scoped** | Users can **only** retrieve tasks associated with `projectId`s where they have an active membership in the `projectMembership` table. |

-----

## Request Parameters (Query)

All parameters are passed as URL query string parameters.

### Filtering Parameters

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `id=uuid-123` | Filter by a specific Task ID. |
| `name` | `string` | `name=database setup` | Performs a **Full-Text Search** on the task name. |
| `priority` | `number` | `priority=5` | Filter by exact priority level. |
| `priorityGt` | `number` | `priorityGt=3` | Filter for tasks with priority greater than the value. |
| `priorityLt` | `number` | `priorityLt=7` | Filter for tasks with priority less than the value. |
| `status` | `enum` | `status=pending` | Filter by task status (e.g., `pending`, `on_process`, `aborted`, `delayed`, `continued`). |
| `projectId` | `string` | `projectId=uuid-123` | Filter by a specific Project ID. |
| `createdById` | `string` | `createdById=user-x` | Filter tasks created by a specific user. |
| `ownerId` | `string` | `ownerId=user-y` | Filter tasks owned (responsible) by a specific user. |
| `claimedById` | `string` | `claimedById=user-z` | Filter tasks actively claimed by a user. |
| `isPinned` | `string` | `isPinned=true` | Filter by pinned status (`"true"` or `"false"`). |
| `isArchived` | `string` | `isArchived=false` | Filter by archived status (`"true"` or `"false"`). |
| `isDeleted` | `string` | `isDeleted=true` | **Default:** Tasks with `deletedAt` are excluded. Set to `"true"` to include soft-deleted tasks. |
| `createdAtGt`/`Lt` | `Date` (Coerced) | `createdAtGt=2024-01-01` | Filter tasks created after/before a specific date. |
| `startAtGt`/`Lt` | `Date` (Coerced) | `startAtLt=2024-12-31` | Filter tasks with start dates after/before a specific date. |
| `endAtGt`/`Lt` | `Date` (Coerced) | | Filter tasks with due/end dates after/before a specific date. |

### Sorting & Pagination Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `orderBy` | `enum` | `createdAt` | Field to sort by: `name`, `priority`, `status`, `createdAt`, `updatedAt`, `startAt`, `endAt`, `deletedAt`. |
| `orderDirection` | `enum` | `desc` | Sorting direction: `asc` (ascending) or `desc` (descending). |
| `page` | `number` | `1` | The current page number for pagination. |

-----

## Successful Response (200 OK)

The endpoint returns a standard paginated response object containing task details, along with relationship data embedded within each task record.

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | `string` | `record_fetched` |
| `message` | `string` | `Success` |
| `status` | `number` | `200` |
| `result` | `object` | `QueryResult` The container for the paginated results. |

### `QueryResult` Object Structure

| Field | Type | Description |
| :--- | :--- | :--- |
| `page` | `number` | The current page number requested. |
| `totalPages` | `number` | The total number of pages available. |
| `totalResults` | `number` | The total number of records matching the filter criteria. |
| `result` | `Array<ExtendedTaskType>` | The array of task objects for the current page. |

### Example Task Structure (in `data.result`)

Each task object includes relational data (users and project details) to avoid additional lookups, fetched using Drizzle's `with` clause.

```json
{
  "id": "uuid-for-task",
  "name": "Design Database Schema",
  // ... other task fields
  "createdBy": {
    "id": "user-x",
    "name": "John Doe",
    "username": "johndoe",
    "image": "..."
  },
  "ownedBy": {
    "id": "user-y",
    "name": "Jane Smith",
    "username": "janesmith",
    "image": "..."
  },
  "project": {
    "id": "project-A",
    "name": "New App Launch",
    // ... other project fields
  },
  "parent": null, // or TaskType if it has a parent
  "children": [
    // Array of child TaskType
  ]
}
```

-----

## ❌ Error Responses

| Status Code | Code | Description |
| :--- | :--- | :--- |
| **400** | `bad_request` | Invalid query parameters (e.g., failed Zod schema validation). |
| **401** | `invalid_session` | User is not authenticated or session expired. |
| **429** | `too_many_requests` | Rate limit exceeded for the client IP address. |
| **500** | `unknown_database_error` | An unexpected error occurred during database operations (e.g., connection issue). |