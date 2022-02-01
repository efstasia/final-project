import { createSlice } from '@reduxjs/toolkit';

import uniqid from 'uniqid';

export const ratings = createSlice({
  name: 'ratings',
  initialState: {
    items: [],
    restaurantName: null,
    selectRating: null,
    selectCategory: null,
    ratingText: null,
    user: '',
    //createdAt: new Date(),
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
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setRestaurantName: (store, action) => {
      store.restaurantName = action.payload;
    },
    setSelectRating: (store, action) => {
      store.selectRating = action.payload;
    },
    setSelectCategory: (store, action) => {
      store.selectCategory = action.payload;
    },
    setRatingText: (store, action) => {
      store.ratingText = action.payload;
    },
    setRadioInput: (store, action) => {
      store.radioInput = action.payload;
    },
    setUser: (store, action) => {
      store.user = action.payload;
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
