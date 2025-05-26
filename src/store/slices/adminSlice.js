import { createSlice } from "@reduxjs/toolkit";
import { createEvent, deleteEvent, updateEvent } from "../thunks/adminThunk";

const adminSlice = createSlice({
    name: "event",
    initialState: {
        createdEventId: null,
        loading: false,
        deletedEventId: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createEvent.fulfilled, (state, action) => {
                state.createdEventId = action.payload;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.deletedEventId = action.payload;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                const idx = state.events.findIndex(e => e._id === action.payload._id);
                if (idx !== -1) state.events[idx] = action.payload;
            });
    },
});

export const adminReducer = adminSlice.reducer;
