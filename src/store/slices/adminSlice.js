import { createSlice } from "@reduxjs/toolkit";
import { createEvent, deleteEvent, updateEvent } from "../thunks/adminThunk";

const adminSlice = createSlice({
    name: "event",
    initialState: {
        createdEventId: null,
        loading: false,
        deletedEventId: null,
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
            .addCase(updateEvent.fulfilled, (state) => {
                // No state mutation here
                // UI is refreshed via fetchEvents()
            });
    },
});


export const adminReducer = adminSlice.reducer;
