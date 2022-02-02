import React, { useState, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useOnClickOutside } from './hooks';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/Globalstyles';
import { lightTheme, darkTheme } from './styles/Themes';
import { useDarkMode } from './components/UseDarkMode';
import Toggle from './components/Toggler';

import { user } from './reducers/user';
import { ratings } from './reducers/ratings';

import { Header } from './components/Header';
import { StartPage } from './components/StartPage';
import SignupPage from './components/SignupPage';
import { UserPage } from './components/UserPage';
import { Footer } from './components/Footer';
import { Burger } from './components/Burger/Burger';
import { Menu } from './components/Menu/Menu';
import { SortingSelect } from './components/SortingSelect';
import { AddRating } from './components/AddRating';
import { MainFeed } from './components/MainFeed';

const reducer = combineReducers({
  user: user.reducer,
  ratings: ratings.reducer,
});
const store = configureStore({ reducer });

export const App = () => {
  const [open, setOpen] = useState(false);
  const [theme, themeToggler] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  // this makes it so we can close the menu anywhere on the screen
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  return (
    <>
      <div>
        <Header />
      </div>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />

        <Toggle theme={theme} toggleTheme={themeToggler} />
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
              <Route path='/feed' element={<MainFeed />} />
              {/*             
            <Route path='/add' element={<AddRating />} /> */}

              {/* user page */}
              <Route path='/userpage' element={<UserPage />} />
            </Routes>
          </Provider>

          {/* <Footer /> */}
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};
