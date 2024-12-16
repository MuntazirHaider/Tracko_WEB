import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./api";

export interface initialStateTypes {
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
    token: string | null;
    user: User | null;
}

const initialState: initialStateTypes = {
    isSidebarCollapsed: false,
    isDarkMode: false,
    token: null,
    user: null,
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    }
});

export const { setIsSidebarCollapsed, setIsDarkMode, setToken, clearToken, setUser, clearUser } = globalSlice.actions;
export default globalSlice.reducer;