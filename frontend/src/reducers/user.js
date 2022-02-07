import { createSlice } from '@reduxjs/toolkit';

export const user = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    username: null,
    accessToken: null,
    email: null,
    error: null,
    firstName: null,
    lastName: null,
    image: null,
    role: null,
  },
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
    setImage: (store, action) => {
      store.image = action.payload;
    },
    setRole: (store, action) => {
      store.role = action.payload;
    },
    logout: (store, action) => {
      store.userId = null;
      store.username = null;
      store.accessToken = null;
      // localStorage.removeItem('accessToken');
    },
  },
});
