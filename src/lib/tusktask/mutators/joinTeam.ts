// Types
export interface TeamMembersRequest {
  authorizationId: string; // notification id
  administratorId: string; // who sent the invite
  teamId: string; // target team
}

export interface TeamMembershipResponse {
  membership: {
    id: string;
    teamId: string;
    userId: string;
    userRole: string;
    joinAt: string;
  };
  teamMemberCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  messages: string;
  data?: T;
  errors?: string[];
}

// Custom error class for better error handling
export class TeamJoinError extends Error {
  constructor(
    public status: number,
    public code: string,
    public userMessage: string,
    public details?: any
  ) {
    super(userMessage);
    this.name = "TeamJoinError";
  }
}

// Validation helpers
const validateUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const validatePayload = (payload: TeamMembersRequest): void => {
  if (!payload.authorizationId?.trim()) {
    throw new TeamJoinError(
      400,
      "MISSING_AUTHORIZATION_ID",
      "Authorization ID is required"
    );
  }

  if (!payload.administratorId?.trim()) {
    throw new TeamJoinError(
      400,
      "MISSING_ADMINISTRATOR_ID",
      "Administrator ID is required"
    );
  }

  if (!payload.teamId?.trim()) {
    throw new TeamJoinError(400, "MISSING_TEAM_ID", "Team ID is required");
  }

  if (!validateUUID(payload.authorizationId)) {
    throw new TeamJoinError(
      400,
      "INVALID_AUTHORIZATION_ID",
      "Invalid authorization ID format"
    );
  }

  if (!validateUUID(payload.administratorId)) {
    throw new TeamJoinError(
      400,
      "INVALID_ADMINISTRATOR_ID",
      "Invalid administrator ID format"
    );
  }

  if (!validateUUID(payload.teamId)) {
    throw new TeamJoinError(400, "INVALID_TEAM_ID", "Invalid team ID format");
  }
};

// Error mapping for user-friendly messages
const mapApiErrorToUserError = (
  status: number,
  apiResponse: ApiResponse
): TeamJoinError => {
  const errorMappings: Record<number, { code: string; message: string }> = {
    400: {
      code: "BAD_REQUEST",
      message: "Invalid request. Please check your invitation link.",
    },
    401: {
      code: "UNAUTHORIZED",
      message: "Please log in to accept this invitation.",
    },
    403: {
      code: "FORBIDDEN",
      message: "This invitation is no longer valid or has expired.",
    },
    404: {
      code: "NOT_FOUND",
      message: "The team you're trying to join could not be found.",
    },
    409: {
      code: "ALREADY_MEMBER",
      message: "You are already a member of this team.",
    },
    429: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a moment and try again.",
    },
    500: {
      code: "SERVER_ERROR",
      message: "Server error. Please try again in a few moments.",
    },
    502: {
      code: "BAD_GATEWAY",
      message: "Service temporarily unavailable. Please try again.",
    },
    503: {
      code: "SERVICE_UNAVAILABLE",
      message: "Service temporarily unavailable. Please try again.",
    },
  };

  const mapping = errorMappings[status] || {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred. Please try again.",
  };

  return new TeamJoinError(
    status,
    mapping.code,
    apiResponse.messages || mapping.message,
    apiResponse
  );
};

// Main mutation function
export async function joinTeamMutation(
  payload: TeamMembersRequest
): Promise<TeamMembershipResponse> {
  try {
    // Validate input payload
    validatePayload(payload);

    // Make API request
    const response = await fetch("/api/memberships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      // Add timeout and signal support
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    // Parse response
    let apiResponse: ApiResponse<TeamMembershipResponse>;
    try {
      apiResponse = await response.json();
    } catch (parseError) {
      throw new TeamJoinError(
        response.status,
        "PARSE_ERROR",
        "Unable to process server response",
        { originalError: parseError }
      );
    }

    // Handle non-ok responses
    if (!response.ok) {
      throw mapApiErrorToUserError(response.status, apiResponse);
    }

    // Validate successful response structure
    if (!apiResponse.data) {
      throw new TeamJoinError(
        500,
        "INVALID_RESPONSE",
        "Invalid response from server",
        apiResponse
      );
    }

    // Validate response data structure
    const { membership, teamMemberCount } = apiResponse.data;

    if (!membership?.id || !membership.teamId || !membership.userId) {
      throw new TeamJoinError(
        500,
        "INVALID_MEMBERSHIP_DATA",
        "Invalid membership data received",
        apiResponse.data
      );
    }

    if (typeof teamMemberCount !== "number" || teamMemberCount < 1) {
      throw new TeamJoinError(
        500,
        "INVALID_MEMBER_COUNT",
        "Invalid team member count received",
        apiResponse.data
      );
    }

    // Return validated data
    return {
      membership: {
        id: membership.id,
        teamId: membership.teamId,
        userId: membership.userId,
        userRole: membership.userRole || "assignee",
        joinAt: membership.joinAt || new Date().toISOString(),
      },
      teamMemberCount,
    };
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof TeamJoinError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new TeamJoinError(
        0,
        "NETWORK_ERROR",
        "Unable to connect to the server. Please check your internet connection.",
        { originalError: error }
      );
    }

    // Handle timeout errors
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new TeamJoinError(
        408,
        "TIMEOUT_ERROR",
        "Request timed out. Please try again.",
        { originalError: error }
      );
    }

    // Handle abort errors
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new TeamJoinError(0, "REQUEST_ABORTED", "Request was cancelled.", {
        originalError: error,
      });
    }

    // Handle unknown errors
    throw new TeamJoinError(
      500,
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again.",
      { originalError: error }
    );
  }
}
