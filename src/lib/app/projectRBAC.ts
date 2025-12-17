export const PROJECT_MEMBERSHIP_ROLES = [
  "owner",
  "admin",
  "member",
  "observer",
] as const;

export interface PROJECT_PERMISSIONS {
  // Task Management
  createTask: boolean;
  updateTask: boolean;
  assignTask: boolean;
  archiveTask: boolean;

  // Task Productivity
  claimTask: boolean;
  completeTask: boolean;

  // Project Management
  updateProject: boolean;
  promoteAdmin: boolean;
  demoteAdmin: boolean;
  promoteMember: boolean;
  demoteMember: boolean;
  inviteMember: boolean;
  suspendMember: boolean;
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

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: true,
    promoteAdmin: true,
    demoteAdmin: true,
    promoteMember: true,
    demoteMember: true,
    inviteMember: true,
    suspendMember: true,
    deleteMembership: true,
  },
  admin: {
    // Task Management
    createTask: true,
    updateTask: true,
    assignTask: true,
    archiveTask: true,

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: true,
    promoteAdmin: false,
    demoteAdmin: false,
    promoteMember: true,
    demoteMember: true,
    inviteMember: true,
    suspendMember: true,
    deleteMembership: false,
  },
  member: {
    // Task Management
    createTask: true,
    updateTask: true,
    assignTask: false,
    archiveTask: false,

    // Task Productivity
    claimTask: true,
    completeTask: true,

    // Project Management
    updateProject: false,
    promoteAdmin: false,
    demoteAdmin: false,
    promoteMember: false,
    demoteMember: false,
    inviteMember: false,
    suspendMember: false,
    deleteMembership: false,
  },
  observer: {
    // Task Management
    createTask: false,
    updateTask: false,
    assignTask: false,
    archiveTask: false,

    // Task Productivity
    claimTask: false,
    completeTask: false,

    // Project Management
    updateProject: false,
    promoteAdmin: false,
    demoteAdmin: false,
    promoteMember: false,
    demoteMember: false,
    inviteMember: false,
    suspendMember: false,
    deleteMembership: false,
  },
} as const;
