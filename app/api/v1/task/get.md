# API Documentation: Get Tasks

## V1_TASK_GET - Fetch a list of Tasks

This endpoint allows an authenticated user to retrieve a paginated list of tasks, filtered and sorted according to various query parameters. Access is restricted to tasks belonging to projects the user is a current member of.

* **Method:** `GET`
* **Path:** `/api/v1/task`
* **With Origin:** `https://tusktask.dimasfahmi.pro/api/v1/task`

-----

## Security & Access Control

| Feature | Requirement | Notes |
| :--- | :--- | :--- |
| **Authentication** | **Required** | A valid session token must be provided. Returns `401 Unauthorized` if the session is invalid. |
| **Rate Limiting** | Strict Policy (50 requests/10s) | Implemented based on the client's IP address. Returns `429 Too Many Requests` if the limit is exceeded. |
| **Authorization** | **Membership Scoped** | Users can **only** retrieve tasks associated with `projectId`s where they have an active membership in the `projectMembership` table. |

-----

## Request Parameters (Query)

All parameters are passed as URL query string parameters.

### Filtering Parameters

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `id=uuid-123` | Filter by a specific Task ID. |
| `name` | `string` | `name=database setup` | Performs a **Full-Text Search** on the task name. |
| `priority` | `number` | `priority=5` | Filter by exact priority level (min 0). |
| `priorityGt` | `number` | `priorityGt=3` | Filter for tasks with priority greater than the value (min 0). |
| `priorityLt` | `number` | `priorityLt=7` | Filter for tasks with priority less than the value (min 1). |
| `status` | `enum` | `status=pending` | Filter by task status (values from `TASK_STATUSES`, e.g., `pending`, `on_process`, `aborted`, `delayed`, `continued`). |
| `createdById` | `string` | `createdById=user-x` | Filter tasks created by a specific user. |
| `ownerId` | `string` | `ownerId=user-y` | Filter tasks owned (responsible) by a specific user. |
| `claimedById` | `string` | `claimedById=user-z` | Filter tasks actively claimed by a user. |
| `completedById` | `string` | `completedById=uuid-123` | Filter tasks by specific user who marked it as completed. |
| `isPinned` | `string`,`boolean` | `isPinned=true` | Filter by pinned status (`"true"` or `"false"`). |
| `isArchived` | `string`,`boolean` | `isArchived=false` | Filter by archived status (`"true"` or `"false"`). |
| `isDeleted` | `string`,`boolean` | `isDeleted=yes` | **Default:** Tasks with `deletedAt` are excluded. Set to `"true"` to show only deleted tasks. Set to `"false"` to explicitly exclude deleted tasks. |
| `isCompleted` | `string`,`boolean` | `isCompleted=no` | Filter by completion status (`"true"` for completed, `"false"` for incomplete). |
| `isOverdue` | `string`,`boolean` | `isOverdue=1` | Filter incomplete tasks that are overdue (`"true"`: endAt < now) or not overdue (`"false"`: endAt > now). |
| `isStartAtNull` | `string`,`boolean` | `isStartAtNull=0` | Filter tasks where `startAt` is null (`"true"`) or not null (`"false"`). |
| `isEndAtNull` | `string`,`boolean` | `isEndAtNull=true` | Filter tasks where `endAt` is null (`"true"`) or not null (`"false"`). |
| `isUpdatedAtNull` | `string`,`boolean` | `isUpdatedAtNull=false` | Filter tasks where `updatedAt` is null (`"true"`) or not null (`"false"`). |
| `createdAtGt` | `Date` (Coerced) | `createdAtGt=2024-01-01` | Filter tasks created after a specific date. |
| `createdAtLt` | `Date` (Coerced) | `createdAtLt=2024-12-31` | Filter tasks created before a specific date. |
| `updatedAtGt` | `Date` (Coerced) | `updatedAtGt=2024-01-01` | Filter tasks updated after a specific date. |
| `updatedAtLt` | `Date` (Coerced) | `updatedAtLt=2024-12-31` | Filter tasks updated before a specific date. |
| `startAtGt` | `Date` (Coerced) | `startAtGt=2024-01-01` | Filter tasks with start dates after a specific date. |
| `startAtLt` | `Date` (Coerced) | `startAtLt=2024-12-31` | Filter tasks with start dates before a specific date. |
| `endAtGt` | `Date` (Coerced) | `endAtGt=2024-01-01` | Filter tasks with due/end dates after a specific date. |
| `endAtLt` | `Date` (Coerced) | `endAtLt=2024-12-31` | Filter tasks with due/end dates before a specific date. |
| `completedAtGt` | `Date` (Coerced) | `completedAtGt=2024-01-01` | Filter tasks completed after a specific date. |
| `completedAtLt` | `Date` (Coerced) | `completedAtLt=2024-12-31` | Filter tasks completed before a specific date. |
| `projectId` | `string` | `projectId=uuid-123` | Filter by a specific Project ID. |
| `parentId` | `string` | `parentId=uuid-123` | Filter tasks by parent task ID. |

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
| `result` | `object` | The container for the paginated results. |

### Result Object Structure

| Field | Type | Description |
| :--- | :--- | :--- |
| `page` | `number` | The current page number requested. |
| `totalPages` | `number` | The total number of pages available. |
| `totalResults` | `number` | The total number of records matching the filter criteria. |
| `result` | `Array<ExtendedTaskType>` | The array of task objects for the current page. |

### Example Task Structure (in `result`)

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
  "claimedBy": {
    "id": "user-z",
    "name": "Alex Johnson",
    "username": "alexj",
    "image": "..."
  },
  "completedBy": {
    "id": "user-w",
    "name": "Sam Lee",
    "username": "samlee",
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