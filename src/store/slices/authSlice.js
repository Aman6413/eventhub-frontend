import { createSlice } from "@reduxjs/toolkit"
import { getMyRegistrations, registerUserThunk, getProfile } from "../thunks/authThunk";

const initialState = {
    user: JSON.parse(localStorage.getItem("eventhub user")) || null,
    loading: false,
    error: null,
    myRegistrations: []
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("eventhub user");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getMyRegistrations.fulfilled, (state, action) => {
                state.myRegistrations = action.payload;
            })
            .addCase(getMyRegistrations.rejected, (state, action) => {
                state.error = action.payload;
            });
            builder
            .addCase(getProfile.fulfilled, (state, action) => {
                // Preserve existing token (if any) so we don't overwrite it with profile data
                const existing = state.user || JSON.parse(localStorage.getItem("eventhub user")) || {};
                const token = existing.token;
                const merged = token ? { ...action.payload, token } : action.payload;
                state.user = merged;
                localStorage.setItem("eventhub user", JSON.stringify(merged));
            });
    }
})

//Exporting actions and reducer
export const { logout, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;