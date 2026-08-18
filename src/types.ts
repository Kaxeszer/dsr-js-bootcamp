export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Task {
    id: string;
    title: string;
    deadline: string;
    completed: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}