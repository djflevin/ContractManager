// Redux Global Store
import {configureStore} from '@reduxjs/toolkit';
import contractReducer from './slices/contractSlice';
import objectDataReducer from './slices/objectDataSlice';
import csvUploadReducer from './slices/csvUploadSlice';
import editObjectReducer from './slices/editObjectSlice';

// Redux Global Store - contains all the reducers
export const store = configureStore({
  reducer: {
    contracts: contractReducer,
    objectData: objectDataReducer,
    csvUpload: csvUploadReducer,
    editObject: editObjectReducer,
  },
});

export default store;


