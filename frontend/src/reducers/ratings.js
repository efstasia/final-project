import { createSlice } from '@reduxjs/toolkit';

export const ratings = createSlice({
  name: 'ratings',
  initialState: {
    items: [],
    restaurantName: null,
    selectRating: null,
    selectCategory: null,
    ratingText: null,
    user: '',
  },

  reducers: {
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
      console.log(action.payload);
      const decreasedItems = store.items.filter(
        item => item._id !== action.payload
      );
      store.items = decreasedItems;
    },
    setError: (store, action) => {
      store.error = action.payload;
    },
  },
});
