import React from 'react';
import ReactDOM from 'react-dom';
import  { BrowserRouter } from "react-router-dom"
import './index.css';
import App from './App/App';
import { Provider } from "react-redux"
import * as serviceworker from './serviceWorker'
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import authReducer from "./store/reducers/authReducer"
const store = createStore(authReducer, applyMiddleware(thunk))

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
  <Provider store = {store}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceworker.register()