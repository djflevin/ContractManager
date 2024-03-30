// Package Imports
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

// Hot Module Replacement
if(module.hot){
  module.hot.accept()
}

// Create a root element
const root = document.createElement('div');

// Append the root element to the bo  dy
document.body.appendChild(root);

// Render the app into the root element
createRoot(root).render(
  <Provider store={store}>
    <App />
  </Provider>
);

