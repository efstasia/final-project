import { createSlice } from '@reduxjs/toolkit';

import { uniqid } from 'uniqid';

export const ratings = createSlice({
  name: 'ratings',
  initialState: {
    items: ['bajsmacka'],
  },

  reducers: {
    addRating: (store, action) => {
      const newRating = {
        id: uniqid(),
        text: action.payload,
        createdAt: new Date(),
      };

      store.items = [...store.items, newRating];
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
  },
});
