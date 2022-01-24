import { createSlice } from '@reduxjs/toolkit';

import uniqid from 'uniqid';

export const ratings = createSlice({
  name: 'ratings',
  initialState: {
    items: [],
  },

  reducers: {
    // addRating: (store, action) => {
    //   const newRating = {
    //     id: uniqid(),
    //     text: action.payload,
    //     //   createdAt: new Date(),
    //   };

    //   store.items = [...store.items, newRating];
    // },
    setRating: (store, action) => {
      store.items = action.payload;
    },

    deleteRating: (store, action) => {
      const decreasedItems = store.items.filter(
        item => item.id !== action.payload
      );
      store.items = decreasedItems;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
    //do we need to add a reducer for search, filter etc?
  },
});
