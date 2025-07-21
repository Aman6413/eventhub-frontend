// src/store/slices/eventSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents } from "../thunks/eventThunk";
// import { updateEvent } from "../thunks/adminThunk";

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchTerm: "",
    filter: "all", // all | technical | cultural
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      // .addCase(updateEvent.fulfilled, (state, action) => {
      //   console.log("✅ updateEvent.fulfilled triggered:", action.payload);
      
      //   const updated = action.payload;
      //   if (!updated || !updated._id) return;
      
      //   const index = state.list.findIndex((e) => e._id === updated._id);
      //   if (index !== -1) {
      //     state.list[index] = updated;
      //   }
      // });      
  },
});

export const { setSearchTerm, setFilter } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
