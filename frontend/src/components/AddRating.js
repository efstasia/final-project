import React, { useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { API_URL } from '../utils/urls';

import { ratings } from '../reducers/ratings';

import {
  InputWrapper,
  Form,
  Button,
  AddButtonContainer,
} from '../styles/Styles';

export const AddRating = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [selectRating, setSelectRating] = useState(0);
  const [selectCategory, setSelectCategory] = useState('');
  const [radioInput, setRadioInput] = useState('');
  const [canWrite, setCanWrite] = useState(false);
  const [input, setInput] = useState('');

  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const userId = useSelector(store => store.user.userId);

  const handleWriteRating = () => {
    setCanWrite(true);
  };

  const handleInputClose = () => {
    setCanWrite(false);
  };

  const onRatingPost = () => {
    const optionsAll = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        ratingText: input,
        restaurantName,
        selectRating,
        selectCategory,
        radioInput,
        user: userId,
      }),
    };

    fetch(API_URL('feed'), optionsAll)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(ratings.actions.setUser(data.response.user));
            dispatch(
              ratings.actions.setRestaurantName(data.response.restaurantName)
            );
            dispatch(
              ratings.actions.setSelectRating(data.response.selectRating)
            );
            dispatch(
              ratings.actions.setSelectCategory(data.response.selectCategory)
            );
            dispatch(ratings.actions.setRatingText(data.response.ratingText));
            dispatch(ratings.actions.setRadioInput(data.response.radioInput));
            setInput('');
            setCanWrite(false);
          });
        }
      });
  };

  return (
    <InputWrapper>
      {!canWrite && (
        <Button className='add-button' onClick={handleWriteRating}>
          <i className='fas fa-plus'></i>
        </Button>
      )}
      {canWrite && (
        <Form onSubmit={onRatingPost}>
          <Button onClick={handleInputClose} className='toggle-button'>
            <i className='fas fa-times'></i>
          </Button>
          <label htmlFor='restaurant'>Restaurant</label>
          <input
            type='text'
            value={restaurantName}
            onChange={event => setRestaurantName(event.target.value)}
          />
          <label htmlFor='ratingText'>Rating text</label>
          <textarea
            rows='4'
            cols='50'
            value={input}
            onChange={event => setInput(event.target.value)}
          ></textarea>
          <label htmlFor='rating'>rating 1-10</label>
          <select
            id='rating'
            value={selectRating}
            onChange={event => setSelectRating(event.target.value)}
          >
            <option>choose rating here</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
          <label htmlFor='category'>category</label>
          <select
            id='category'
            value={selectCategory}
            onChange={event => setSelectCategory(event.target.value)}
          >
            <option>choose category here</option>
            <option value='Hamburger'>Hamburger</option>
            <option value='Sushi'>Sushi</option>
            <option value='Pizza'>Pizza</option>
            <option value='Pasta'>Pasta</option>
            <option value='Other'>Other</option>
          </select>

          <label htmlFor='radio-buttons'>Would you recommend?</label>
          <label htmlFor='yes'>yes</label>
          <input
            id='radio-buttons'
            type='radio'
            name='recommend'
            value='yes'
            onChange={event => setRadioInput(event.target.value)}
          />
          <label htmlFor='no'>no</label>
          <input
            id='radio-buttons'
            type='radio'
            name='recommend'
            value='no'
            onChange={event => setRadioInput(event.target.value)}
          />

          <AddButtonContainer>
            <Button type='submit'>ADD RATING</Button>
          </AddButtonContainer>
        </Form>
      )}
    </InputWrapper>
  );
};
