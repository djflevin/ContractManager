import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  csvData : null,
  validFile: false,
  validData: false,
  csvFileName: null,
  validProjectRows : [],
  invalidProjectRows: [],
  errorMessages: [],
};

export const csvUploadSlice = createSlice({
  name: 'csvUpload',
  initialState,
  reducers: {
    setCSVData: (state, action) => {
      state.csvData = action.payload;
    },
    setValidProjectRows: (state, action) => {
      state.validProjectRows = action.payload;
    },
    setInvalidProjectRows: (state, action) => {
      state.invalidProjectRows = action.payload;
    },
    setValidFile: (state, action) => {
      state.validFile = action.payload;
    },
    setValidData: (state, action) => {
      state.validData = action.payload;
    },
    setCSVFileName: (state, action) => {
      state.csvFileName = action.payload;
    },
    setErrorMessages: (state, action) => {
      state.errorMessages = action.payload;
    },
    // Updating a specific index in the validProjectRows array of objects
    updateValidProjectRows: (state, action) => {
      const {index, key, value} = action.payload;
      state.validProjectRows[index][key] = value;
    },

    updateValidProjectRow: (state, action) => {
      // Update a specific row in the validProjectRows array of objects
      const {index, row} = action.payload;
      state.validProjectRows[index] = row;
    },

    updateInvalidProjectRow: (state, action) => {
      // Update a specific row in the invalidProjectRows array of objects
      const {index, row} = action.payload;
      state.invalidProjectRows[index] = row;
    },
    
    
    updateInvalidProjectRows: (state, action) => {
      const {index, key, value} = action.payload;
      state.invalidProjectRows[index][key] = value;
    },
    // Removing a specific index in the validProjectRows array of objects 
    removeValidProjectRow: (state, action) => {
      const {index} = action.payload;
      state.validProjectRows.splice(index, 1);
    },
    removeInvalidProjectRow: (state, action) => {
      const {index} = action.payload;
      state.invalidProjectRows.splice(index, 1);
    },
    pushValidProjectRows: (state, action) => {
      state.validProjectRows.push(action.payload);
    },
    pushInvalidProjectRows: (state, action) => {
      state.invalidProjectRows.push(action.payload);
    }
  }
});

export const {setCSVData} = csvUploadSlice.actions;
export const {setValidProjectRows} = csvUploadSlice.actions;
export const {setInvalidProjectRows} = csvUploadSlice.actions;
export const {setUploadSummary} = csvUploadSlice.actions;
export const {setValidFile} = csvUploadSlice.actions;
export const {setValidData} = csvUploadSlice.actions;
export const {setCSVFileName} = csvUploadSlice.actions;
export const {setErrorMessages} = csvUploadSlice.actions;
export const {updateValidProjectRows} = csvUploadSlice.actions;
export const {updateInvalidProjectRows} = csvUploadSlice.actions;
export const {removeValidProjectRow} = csvUploadSlice.actions;
export const {removeInvalidProjectRow} = csvUploadSlice.actions;
export const {pushValidProjectRows} = csvUploadSlice.actions;
export const {pushInvalidProjectRows} = csvUploadSlice.actions;
export const {updateValidProjectRow} = csvUploadSlice.actions;
export const {updateInvalidProjectRow} = csvUploadSlice.actions;

// Setting the state with API data
export const selectCSVData = state => state.csvUpload.csvData;
export const selectvalidProjectRows = state => state.csvUpload.validProjectRows;
export const selectinvalidProjectRows = state => state.csvUpload.invalidProjectRows;
export const selectUploadSummary = state => state.csvUpload.uploadSummary;
export const selectValidFile = state => state.csvUpload.validFile;
export const selectValidData = state => state.csvUpload.validData;
export const selectCSVFileName = state => state.csvUpload.csvFileName;
export const selectErrorMessages = state => state.csvUpload.errorMessages;

export default csvUploadSlice.reducer;


