import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const registerUserThunk = createAsyncThunk("auth/register", async (userData) => {
    try {
        const res = await axios({
            method: "POST",
            url: `${API_BASE_URL}/auth/register`,
            data: userData
        })
        if (res.data) {
            localStorage.setItem("eventhub user", JSON.stringify(res.data));
        }
        return res.data;
    } catch (error) {
        if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
})

export const loginUser = createAsyncThunk("auth/login", async (userData) => {
    try {
        const res = await axios({
            method: "POST",
            url: `${API_BASE_URL}/auth/login`,
            data: userData
        })

        if (res.data) {
            localStorage.setItem("eventhub user", JSON.stringify(res.data));
        }

        return res.data;
    } catch (error) {
        if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
})

export const getMyRegistrations = createAsyncThunk("user/myRegisterations", async (token) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${API_BASE_URL}/users/me/registrations`,
            headers: { Authorization: `Bearer ${token}` }
        });
        const registeredEvents = response.data.events;
        return registeredEvents;
    } catch (error) {
        if (error.response.status == 400) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
})