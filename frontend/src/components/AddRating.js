import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';

import { InputWrapper, Form, Button } from '../styles/Styles';

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

  const handleFormSubmit = event => {
    event.preventDefault();
  };

  const onRatingPost = event => {
    window.location.reload(true);
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

    fetch(`http://localhost:8080/feed`, optionsAll)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(ratings.actions.setRating(data.response.rating));
            dispatch(user.actions.setUsername(data.response.username));
            setInput('');
            setCanWrite(false);
          });
        }
      });

    event.preventDefault();
  };

  return (
    <InputWrapper>
      {!canWrite && (
        <Button
          style={{
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            position: 'relative',
            left: '94%',
            top: '10px',
          }}
          onClick={handleWriteRating}
        >
          <i className='fas fa-plus'></i>
        </Button>
      )}
      {canWrite && (
        <Form onSubmit={handleFormSubmit}>
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
            <option value='Pizza'>Pizza</option>
            <option value='Pasta'>Pasta</option>
            <option value='Hamburger'>Hamburger</option>
            <option value='Sushi'>Sushi</option>
            <option value='Other'>Other</option>
          </select>
          <div className='radio-button'>
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
          </div>

          <button onClick={onRatingPost}>Add rating</button>
          <button onClick={handleInputClose} className='toggle-button'>
            close
          </button>
        </Form>
      )}
    </InputWrapper>
  );
};
