import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { user } from './reducers/user';
import { ratings } from './reducers/ratings';

import { Header } from './components/Header';
import { StartPage } from './components/StartPage';
import { MainPage } from './components/MainPage';
import SignupPage from './components/SignupPage';
import { UserPage } from './components/UserPage';

const reducer = combineReducers({
  user: user.reducer,
  ratings: ratings.reducer,
});
const store = configureStore({ reducer });

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Provider store={store}>
        <Routes>
          {/* information */}
          <Route path='/' element={<StartPage />} />
          {/* signin/signup */}
          <Route path='/signup' element={<SignupPage />} />
          {/* main page once logged in */}
          <Route path='/main' element={<MainPage />} />
          {/* user page */}
          <Route path='/user' element={<UserPage />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};
