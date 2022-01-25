import React, { useState, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useOnClickOutside } from './hooks';

import { user } from './reducers/user';
import { ratings } from './reducers/ratings';

import { Header } from './components/Header';
import { StartPage } from './components/StartPage';
import { MainPage } from './components/MainPage';
import SignupPage from './components/SignupPage';
import { UserPage } from './components/UserPage';
import { Footer } from './components/Footer';
import { Burger } from './components/Burger/Burger';
import { Menu } from './components/Menu/Menu';

const reducer = combineReducers({
  user: user.reducer,
  ratings: ratings.reducer,
});
const store = configureStore({ reducer });

export const App = () => {
  const [open, setOpen] = useState(false);

  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  return (
    <>
      <div>
        <Header />
      </div>
      <BrowserRouter>
        <Provider store={store}>
          <div ref={node}>
            <Burger open={open} setOpen={setOpen} />
            <Menu open={open} setOpen={setOpen} />
          </div>
          <Routes>
            <Route path='/' element={<StartPage />} />

            {/* signin/signup */}
            <Route path='/signup' element={<SignupPage />} />

            {/* main page once logged in */}
            <Route path='/feed' element={<MainPage />} />

            {/* user page */}
            <Route path='/userpage' element={<UserPage />} />
          </Routes>
        </Provider>

        <Footer />
      </BrowserRouter>
    </>
  );
};
