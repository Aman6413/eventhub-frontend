import { createSlice } from "@reduxjs/toolkit";
import { fetchEventById, getMyRegistrations, registerForEvent } from "../thunks/eventDetailThunk";

const initialState = {
  selectedEvent: null,
  loading: false,
  error: null,
  registrationMessage: null,
};

const eventDetailSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventState: (state) => {
      state.selectedEvent = null;
      state.loading = false;
      state.error = null;
      state.registrationMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.registrationMessage = action.payload;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registrationMessage = action.payload;
      });
  },
});

export const { clearEventState } = eventDetailSlice.actions;
export const eventDetailReducer = eventDetailSlice.reducer;
