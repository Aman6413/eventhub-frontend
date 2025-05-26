import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const fetchEventById = createAsyncThunk("eventDetail/fetch", async (fetchEventParams) => {
  try {
    const response = await axios({
        method: "GET",
        url: `${API_BASE_URL}/events/${fetchEventParams.eventId}`,
        headers: { Authorization: `Bearer ${fetchEventParams.token}`}
    });
    return response.data.event;
  } catch (error) {
    if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
    else throw new Error("Something went wrong");
  }
});

export const registerForEvent = createAsyncThunk("eventDetail/register", async (registerDetails) => {
    try {
    const response = await axios({
        method: "POST",
        url: `${API_BASE_URL}/events/${registerDetails.eventId}/register`,
        headers: { Authorization: `Bearer ${registerDetails.token}`}
    });
    return response.data.message;
  } catch (error) {
    if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
    else throw new Error("Something went wrong");
  }
  }
);