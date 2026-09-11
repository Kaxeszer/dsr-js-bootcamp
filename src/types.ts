export interface User {
    id: string;
    nickname: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskVisibility = 'ONLY_ME' | 'LIST' | 'ANYONE';
export type AssignmentStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserRef {
    id: string;
    nickname: string;
    email?: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    visibility: TaskVisibility;
    creator: UserRef;
    assignee: UserRef | null;
    assignmentStatus: AssignmentStatus;
    assignedById: string | null;
    viewerUserIds: string[];
    tags: Tag[];
    createdAt: string;
}

export interface TaskListResponse {
    items: Task[];
    total: number;
    page: number;
    pageSize: number;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface UserPicker {
    id: string;
    nickname: string;
    email?: string;
    role: 'USER' | 'ADMIN';
}

export interface AdminUserRow {
    id: string;
    nickname: string;
    email?: string;
    role: 'USER' | 'ADMIN';
    bannedAt: string | null;
    createdAt: string;
}

export interface AssignmentBlock {
    id: string;
    blockerId: string;
    blockedUserId: string;
    comment?: string;
    createdAt: string;
}

export interface AssignmentBlockWithUser extends AssignmentBlock {
    blockedUser: UserRef;
}

export interface AssignmentBlockAdminRow extends AssignmentBlock {
    blocker: UserRef;
    blockedUser: UserRef;
}