// src/redux/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearUI(state) {
      return initialState;
    },
  },
});

export const { setLoading, setError, setTheme, clearUI } = uiSlice.actions;
export default uiSlice.reducer;
