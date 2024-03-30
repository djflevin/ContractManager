import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  student : null,
  project : null,
  project_list : [],
  framework : null,
  organisation : null,
  studentLetterTemplate : null,
  projectDescriptionTemplate : null,
  frameworkTemplate : null,
};


export const objectDataSlice = createSlice({
  name: 'objectData',
  initialState,
  reducers: {
    setStudent: (state, action) => {
      state.student = action.payload;
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setProjectList: (state, action) => {
      state.project_list = action.payload;
    },
    setFramework: (state, action) => {
      state.framework = action.payload;
    },
    setOrganisation: (state, action) => {
      state.organisation = action.payload;
    },
  }
});

export const {setStudent, setProject, setProjectList, setFramework, setOrganisation} = objectDataSlice.actions;

// Setting the state with API data
export const selectStudent = state => state.objectData.student;
export const selectProject = state => state.objectData.project;
export const selectProjectList = state => state.objectData.project_list;
export const selectFramework = state => state.objectData.framework;
export const selectOrganisation = state => state.objectData.organisation;

export default objectDataSlice.reducer;



