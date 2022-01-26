import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('user')
  ? {
      userId: JSON.parse(localStorage.getItem('user')).userId,
      username: JSON.parse(localStorage.getItem('user')).username,
      email: JSON.parse(localStorage.getItem('user')).email,
      firstName: JSON.parse(localStorage.getItem('user')).firstName,
      lastName: JSON.parse(localStorage.getItem('user')).lastName,
      accessToken: JSON.parse(localStorage.getItem('user')).accessToken,
    }
  : {
      userId: null,
      username: null,
      accessToken: null,
      email: null,
      error: null,
    };

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (store, action) => {
      store.email = action.payload;
    },

    setUserId: (store, action) => {
      store.userId = action.payload;
    },
    setUsername: (store, action) => {
      store.username = action.payload;
    },
    setFirstName: (store, action) => {
      store.firstName = action.payload;
    },
    setLastName: (store, action) => {
      store.lastName = action.payload;
    },
    setAccessToken: (store, action) => {
      store.accessToken = action.payload;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
    logout: (store, action) => {
      store.userId = null;
      store.username = null;
      store.accessToken = null;
      localStorage.removeItem('accessToken');
    },
  },
});
