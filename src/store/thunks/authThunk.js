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
        const msg = error.response?.data?.errorMessage || error.response?.data || error.message || "Something went wrong";
        throw new Error(msg);
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
        const msg = error.response?.data?.errorMessage || error.response?.data || error.message || "Something went wrong";
        throw new Error(msg);
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
        const msg = error.response?.data?.errorMessage || error.response?.data || error.message || "Something went wrong";
        throw new Error(msg);
    }
})

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API_BASE_URL}/auth/forgot-password`,
            data: { email }
        });
        return res.data;
    } catch (error) {
        if (error.response?.data?.errorMessage) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API_BASE_URL}/auth/verify-otp`,
            data: { email, otp }
        });
        return res.data;
    } catch (error) {
        if (error.response?.data?.errorMessage) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ resetToken, newPassword }) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API_BASE_URL}/auth/reset-password`,
            data: { resetToken, newPassword }
        });
        return res.data;
    } catch (error) {
        if (error.response?.data?.errorMessage) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
});

export const getProfile = createAsyncThunk("auth/getProfile", async (token) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${API_BASE_URL}/users/me`,
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.user;
    } catch (error) {
        if (error.response?.data?.errorMessage) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
});

export const changePassword = createAsyncThunk("auth/changePassword", async ({ token, oldPassword, newPassword }) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: `${API_BASE_URL}/users/change-password`,
            headers: { Authorization: `Bearer ${token}` },
            data: { oldPassword, newPassword }
        });
        return res.data;
    } catch (error) {
        if (error.response?.data?.errorMessage) throw new Error(error.response.data.errorMessage);
        else throw new Error("Something went wrong");
    }
});