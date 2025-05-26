import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { eventReducer } from "./slices/eventSlice";
import { eventDetailReducer } from "./slices/eventDetailSlice";
import { adminReducer } from "./slices/adminSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventReducer,
        eventDetail: eventDetailReducer,
        admin: adminReducer
    }
})

export default store;