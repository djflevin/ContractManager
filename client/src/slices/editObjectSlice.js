import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  objectToEdit : null,
  objectToEditType : null,
  objectToEditID : null,
};

export const editObjectSlice = createSlice({
  name: 'editObject',
  initialState,
  reducers: {
    setObjectToEdit: (state, action) => {
      state.objectToEdit = action.payload;
    },
    setObjectToEditType: (state, action) => {
      state.objectToEditType = action.payload;
    },
    setObjectToEditID: (state, action) => {
      state.objectToEditID = action.payload;
    }
  }
});

export const {setObjectToEdit} = editObjectSlice.actions;
export const {setObjectToEditType} = editObjectSlice.actions;
export const {setObjectToEditID} = editObjectSlice.actions;
// Setting the state with API data
export const selectObjectToEdit = state => state.editObject.objectToEdit;
export const selectObjectToEditType = state => state.editObject.objectToEditType;
export const selectObjectToEditID = state => state.editObject.objectToEditID;

export default editObjectSlice.reducer;


