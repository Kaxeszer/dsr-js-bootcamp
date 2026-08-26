export interface User {
    id: string;
    nickname: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface Task {
    id: string;
    title: string;
    deadline: string;
    completed: boolean;
}

export interface AuthTokens {
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}