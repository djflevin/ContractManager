import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  studentLetters: [],
  projectDescriptions: [],
  frameworkAgreements: [],  
  studentLetter : null,
  projectDescription : null,
  frameworkAgreement : null,
};

export const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setStudentLetters: (state, action) => {
      state.studentLetters = action.payload;
    },

    setProjectDescriptions: (state, action) => {
      state.projectDescriptions = action.payload;
    },

    setFrameworkAgreements: (state, action) => {
      state.frameworkAgreements = action.payload;
    },

    setStudentLetter: (state, action) => {
      state.studentLetter = action.payload;
    },

    setProjectDescription: (state, action) => {
      state.projectDescription = action.payload;
    },

    setFrameworkAgreement: (state, action) => {
      state.frameworkAgreement = action.payload;
    },

  }
});

export const {
  setStudentLetters, 
  setProjectDescriptions, 
  setFrameworkAgreements,
  setStudentLetter, 
  setProjectDescription, 
  setFrameworkAgreement,

} = contractSlice.actions;
// Setting the state with API data
export const selectStudentLetters = state => state.contracts.studentLetters;
export const selectProjectDescriptions = state => state.contracts.projectDescriptions;
export const selectFrameworkAgreements = state => state.contracts.frameworkAgreements;
export const selectStudentLetter = state => state.contracts.studentLetter;
export const selectProjectDescription = state => state.contracts.projectDescription;
export const selectFrameworkAgreement = state => state.contracts.frameworkAgreement;

export default contractSlice.reducer;

