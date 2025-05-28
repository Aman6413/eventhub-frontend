import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const createEvent = createAsyncThunk("events/create", async (createEventParams) => {
  const response = await axios({
    method: "POST",
    url: `${API_BASE_URL}/admin/events`,
    data: createEventParams.data,
    headers: { Authorization: `Bearer ${createEventParams.token}` }
  });
  return response.data.id;
});

export const deleteEvent = createAsyncThunk("events/delete", async (deleteEventParams) => {
  const response = await axios({
    method: "DELETE",
    url: `${API_BASE_URL}/admin/events/${deleteEventParams.id}`,
    headers: { Authorization: `Bearer ${deleteEventParams.token}` }
  })
  return response.data;
});

export const fetchEventRegistrations = createAsyncThunk("registrations/fetch", async (fetchRegistrationsParams) => {
  const response = await axios({
    method: "GET",
    url: `${API_BASE_URL}/admin/events/${fetchRegistrationsParams.id}/registrations`,
    headers: { Authorization: `Bearer ${fetchRegistrationsParams.token}` }
  })
  return response.data;
})

export const updateEvent = createAsyncThunk("events/update", async ({ id, data }) => {
  const res = await axios.put(`/api/events/${id}`, data);
  return res.data;
});
