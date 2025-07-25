// src/redux/companySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  selectedCompany: null,
  expenses: [],
  members: [],
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies(state, action) {
      state.companies = action.payload;
    },
    selectCompany(state, action) {
      state.selectedCompany = action.payload;
    },
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    setMembers(state, action) {
      state.members = action.payload;
    },
    clearCompanyData(state) {
      return initialState;
    },
  },
});

export const {
  setCompanies,
  selectCompany,
  setExpenses,
  setMembers,
  clearCompanyData,
} = companySlice.actions;

export default companySlice.reducer;
