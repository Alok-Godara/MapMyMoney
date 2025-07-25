// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import companyReducer from "./companySlice";
import uiReducer from "./uiSlice";

const store = configureStore({
  reducer: {
    user:  userReducer,
    company: companyReducer,
    ui: uiReducer,
  },
});

export default store;
