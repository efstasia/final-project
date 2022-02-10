import React, { useState, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
} from '@reduxjs/toolkit';
import { useOnClickOutside } from './hooks';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/Globalstyles';
import { lightTheme, darkTheme } from './styles/Themes';
import { useDarkMode } from './components/UseDarkMode';

import { user } from './reducers/user';
import { ratings } from './reducers/ratings';

import { Header } from './components/Header';

import { Footer } from './components/Footer';
import { Burger } from './components/Burger/Burger';
import { Menu } from './components/Menu/Menu';

import { MainFeed } from './pages/MainFeed';
import { StartPage } from './pages/StartPage';
import SignupPage from './pages/SignupPage';
import { UserPage } from './pages/UserPage';

const reducer = combineReducers({
  user: user.reducer,
  ratings: ratings.reducer,
});

const persistedStateJSON = localStorage.getItem('userReduxState');
let persistedState = {};
if (persistedStateJSON) {
  persistedState = JSON.parse(persistedStateJSON);
}

const composedEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(reducer, persistedState);
store.subscribe(() => {
  localStorage.setItem('userReduxState', JSON.stringify(store.getState()));
  composedEnhancers(applyMiddleware(thunkMiddleware));
});

export const App = () => {
  const [open, setOpen] = useState(false);
  const [theme, themeToggler] = useDarkMode();

  const themeMode = theme === 'dark' ? darkTheme : lightTheme;

  // this makes it so we can close the menu anywhere on the screen
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  return (
    <>
      <ThemeProvider theme={themeMode} themeToggler={themeToggler}>
        <Header theme={theme} themeToggler={themeToggler} />

        <GlobalStyles />
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

              {/* user page */}
              <Route path='/userpage/:userId' element={<UserPage />} />
            </Routes>
          </Provider>
        </BrowserRouter>
        <Footer />
      </ThemeProvider>
    </>
  );
};
