import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchEvents = createAsyncThunk("events/fetch", async (token) => {
  try {
    const response = await axios({
        method: "GET",
        url: `${API_BASE_URL}/events`,
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error) {
    if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
    else throw new Error("Something went wrong");
  }
});