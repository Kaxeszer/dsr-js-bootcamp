export interface User {
    id: string;
    nickname: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskVisibility = 'ONLY_ME' | 'LIST' | 'ANYONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    visibility: TaskVisibility;
    viewerUserIds: string[];
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