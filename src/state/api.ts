import { RootState } from "@/app/redux";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export enum Status {
    ToDo = "To Do",
    InProgress = "In Progress",
    UnderReview = "Under Review",
    Completed = "Completed",
}

export enum Priority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Urgent = "Urgent",
    Backlog = "Backlog",
}

export enum Roles {
    Admin = "Admin",
    ProjectManager = "Project Manager",
    Developer = "Developer",
    Viewer = "Viewer"
}

export interface User {
    userId?: number;
    username: string;
    profilePictureUrl?: string;
    role: Roles;
    password?: string;
    organizationId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadById: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export interface SearchResult {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
}

const customBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const baseQueryWithHeaders = async (args: any, api: any, extraOptions: any) => {
    const { getState } = api;
    const token = (getState() as RootState).global.token;

    const headers: HeadersInit = {};

    // Check if it's a sign-in or sign-up request
    if (args.url === 'auth/signin' || args.url === 'auth/signup') {
        headers['Accept'] = 'application/json';
    } else if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return customBaseQuery({ ...args, headers }, api, extraOptions);
};


export const api = createApi({
    baseQuery: baseQueryWithHeaders,
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users",],
    endpoints: (build) => ({
        // signin user
        signIn: build.mutation<any, { username: string; password: string }>({
            query: (credentials) => ({
                url: "auth/signin",
                method: "POST",
                body: credentials,
            }),
        }),
        // signup user
        signUp: build.mutation<any, { username: string; password: string; organizationName: string; industry: string; established: string; }>({
            query: (credentials) => ({
                url: "auth/signup",
                method: "POST",
                body: credentials,
            }),
        }),
        // get project
        getProjects: build.query<Project[], void>({
            query: () => ({
                url: "projects",
                method: "GET",
            }),
            providesTags: ["Projects"],
        }),
        // create project
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects",
                method: "POST",
                body: project,
            }),
            invalidatesTags: ["Projects"],
        }),
        // get tasks
        getTasks: build.query<Task[], { projectId: number }>({
            query: ({ projectId }) => ({
                url: `tasks?projectId=${projectId}`,
                method: "GET"
            }),
            providesTags: (result) => result ? result.map(({ id }) => ({ type: "Tasks" as const, id })) : [{ type: "Tasks" as const }],
        }),
        // create task
        createTask: build.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks",
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Tasks"],
        }),
        // update task
        updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
            query: ({ taskId, status }) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: "Tasks", id: taskId }
            ],
        }),
        // search
        search: build.query<SearchResult, string>({
            query: (query) => ({
                url: `search?query=${query}`,
                method: "GET",
            })
        }),
        // get users
        getUsers: build.query<User[], void>({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            providesTags: ["Users"]
        }),
        // get user by username
        getUserByUsername: build.query<User, {username: string}>({
            query: ({username}) => ({
                url: `/users/${username}`,
                method: "GET",
            }),
        }),
        // add user
        addUser: build.mutation<any, { username: string; password: string; organizationId?: number; role: string; profilePictureUrl: string | null }>({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),
        // update user
        updateUser: build.mutation<any, User>({
            query: (data) => ({
                url: "/users",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Users"],
        }),
        // update profile
        updateProfile: build.mutation<any, Partial<User>>({
            query: (data) => ({
                url: "/users",
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Users"],
        }),
        // delete task
        deleteTask: build.mutation<Task, { taskId: number }>({
            query: ({ taskId }) => ({
                url: `tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"]
        }),
        // get user task
        getTasksByUser: build.query<Task[], number>({
            query: (userId) => ({
                url: `tasks/user/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) =>
                result
                    ? result.map(({ id }) => ({ type: "Tasks", id }))
                    : [{ type: "Tasks", id: userId }],
        }),
        // create new comment
        createComment: build.mutation<Comment, {newComment: string, taskId: number, userId: number | undefined}>({
            query: (comment) => ({
                url: "tasks/comment",
                method: "POST",
                body: comment,
            }),
            invalidatesTags: ["Tasks"]
        }),
        // create new attachment
        createAttachment: build.mutation<Attachment, {fileURL: string, taskId: number | undefined, userId: number | undefined}>({
            query: (attachment) => ({
                url: "tasks/attachment/",
                method: "POST",
                body: attachment,
            }),
            invalidatesTags: ["Tasks"]
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useSearchQuery,
    useGetUsersQuery,
    useGetUserByUsernameQuery,
    useGetTasksByUserQuery,
    useSignInMutation,
    useSignUpMutation,
    useUpdateUserMutation,
    useUpdateProfileMutation,
    useAddUserMutation,
    useDeleteTaskMutation,
    useCreateCommentMutation,
    useCreateAttachmentMutation
} = api;