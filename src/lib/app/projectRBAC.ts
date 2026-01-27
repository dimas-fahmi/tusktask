export const PROJECT_MEMBERSHIP_ROLES = [
  "owner",
  "admin",
  "member",
  "observer",
] as const;

export const PROJECT_MEMBERSHIP_ROLE_HIERARCHY: Record<
  (typeof PROJECT_MEMBERSHIP_ROLES)[number],
  number
> = {
  owner: 0,
  admin: 1,
  member: 2,
  observer: 3,
};

export interface PROJECT_PERMISSIONS {
  // Task Management
  createTask: boolean;
  updateTask: boolean;
  assignTask: boolean;
  archiveTask: boolean;
  deleteTask: boolean;

  // Task Productivity
  claimTask: boolean;
  completeTask: boolean;

  // Project Management
  updateProject: boolean;
  inviteMember: boolean;
  suspendMember: boolean;
  manageMembership: boolean;
  deleteMembership: boolean;
}

export const PROJECT_MEMBERSHIP_ROLE_PERMISSIONS: Record<
  (typeof PROJECT_MEMBERSHIP_ROLES)[number],
  PROJECT_PERMISSIONS
> = {
  owner: {
    // Task Management
    createTask: true,
    updateTask: true,
    assignTask: true,
    archiveTask: true,
    deleteTask: true,

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: true,
    inviteMember: true,
    suspendMember: true,
    manageMembership: true,
    deleteMembership: true,
  },
  admin: {
    // Task Management
    createTask: true,
    updateTask: true,
    assignTask: true,
    archiveTask: true,
    deleteTask: true,

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: true,
    inviteMember: true,
    suspendMember: true,
    manageMembership: true,
    deleteMembership: false,
  },
  member: {
    // Task Management
    createTask: true,
    updateTask: true,
    assignTask: false,
    archiveTask: false,
    deleteTask: false,

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: false,
    inviteMember: false,
    suspendMember: false,
    manageMembership: false,
    deleteMembership: false,
  },
  observer: {
    // Task Management
    createTask: false,
    updateTask: false,
    assignTask: false,
    archiveTask: false,
    deleteTask: false,

    // Task Productivity
    claimTask: false,
    completeTask: false,

    // Project Management
    updateProject: false,
    inviteMember: false,
    suspendMember: false,
    manageMembership: false,
    deleteMembership: false,
  },
} as const;
