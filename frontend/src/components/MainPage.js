import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';

const InputWrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
    border: 2px solid green;
    /* width: 100%; */
    align-items: center;
    gap: 7px;
    width: 50%;
    margin: auto;

    textarea {
      resize: none;
    }

    /* .toggle-button {
      transition: all 0.5s ease-in-out;
    } */
  }
`;

const RatingContainer = styled.div`
  border: 2px solid black;
  width: 50%;
  margin: auto;
`;

// signed in content, first page you see
export const MainPage = () => {
  const [validationError, setValidationError] = useState(null); // setValidationErrors needs to be connected to backend error msg
  const [rating, setRating] = useState([]);
  const [canWrite, setCanWrite] = useState(false);
  const [input, setInput] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [selectRating, setSelectRating] = useState(0);
  const [selectCategory, setSelectCategory] = useState('');
  const [radioInput, setRadioInput] = useState('');

  const navigate = useNavigate();
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

  // if there is no accessToken then redirect to login
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // this handles the POSTING of ratings, added wednesday evening
  const onRatingPost = event => {
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
      }),
    };

    const optionsUser = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
        'Access-Control-Allow-Origin': '*',
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
        fetch(`http://localhost:8080/userpage`, optionsUser);

        if (data.success) {
          batch(() => {
            dispatch(ratings.actions.addRating(data.response));
            dispatch(ratings.actions.setError(null));
            // navigate('/main');  unnecessary?
            setInput('');
            setCanWrite(false);
          });
        } else {
          batch(() => {
            dispatch(ratings.actions.addRating([]));
            dispatch(ratings.actions.setError(data.response));
          });
        }
      });

    event.preventDefault();
  };

  // // post ratings to feed
  // fetch('http://localhost:8080/ratings', options)
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data.success) {
  //       batch(() => {
  //         dispatch(ratings.actions.addRating(data.response));
  //         dispatch(ratings.actions.setError(null));
  //         // navigate('/main');  unnecessary?
  //         setInput('');
  //         setCanWrite(false);
  //       });
  //     } else {
  //       batch(() => {
  //         dispatch(ratings.actions.addRating([]));
  //         dispatch(ratings.actions.setError(data.response));
  //       });
  //     }
  //   });

  // //post ratings to user
  // fetch('http://localhost:8080/user', options)
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data.success) {
  //       batch(() => {
  //         dispatch(ratings.actions.addRating(data.response));
  //         dispatch(ratings.actions.setError(null));
  //         // navigate('/main');  unnecessary?
  //         setInput('');
  //         setCanWrite(false);
  //       });
  //     } else {
  //       batch(() => {
  //         dispatch(ratings.actions.addRating([]));
  //         dispatch(ratings.actions.setError(data.response));
  //       });
  //     }
  //   });

  // this deletes a rating
  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        const remainingRatings = rating.filter(rate => rate._id !== data._id); // need something similar in search function?
        return setRating(remainingRatings); // this deletes the rating WITHOUT refresh
      });
  };

  // handles  the GETTING of rating to show
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch('http://localhost:8080/feed', options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.addRating(data.response));
        dispatch(ratings.actions.setError(null));
        setRating(data.response);
      });
  }, [
    accessToken,
    dispatch,
    input,
    // restaurantName,
    // selectRating,
    // selectCategory,
    // radioInput,
  ]);

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };

  return (
    <div>
      <Link to='/userpage'>To your profile</Link>
      <div>
        {!canWrite && (
          <button onClick={() => handleWriteRating()}>ADD RATING</button>
        )}
      </div>
      <InputWrapper>
        {canWrite && (
          <form onSubmit={handleFormSubmit}>
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
              {/* is value needed here? */}
              <option>choose rating here</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
            <label htmlFor='category'>category</label>
            <select
              id='category'
              value={selectCategory}
              onChange={event => setSelectCategory(event.target.value)}
            >
              {/* is value needed here? */}
              <option>choose category here</option>
              <option value='Pizza'>Pizza</option>
              <option value='Pasta'>Pasta</option>
              <option>Hamburger</option>
              <option>Sushi</option>
              <option>Indian food</option>
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

            <button onClick={onRatingPost}>Add rating</button>
            <button onClick={handleInputClose} className='toggle-button'>
              close
            </button>
          </form>
        )}
      </InputWrapper>
      {/* add everything from backend/useState in the map */}

      <RatingContainer>
        {rating.map(item => (
          <div key={item._id}>
            <p>
              RESTAURANT NAME: {item.restaurantName} RATING TEXT:
              {item.ratingText} RATING: {item.selectRating} CATEGORY:{' '}
              {item.selectCategory} RECOMMEND? {item.radioInput}
            </p>
            <button onClick={() => onDeleteRating(item._id)}>DELETE</button>
          </div>
        ))}
      </RatingContainer>

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}

      <h1>Hello world, this is the signed in content</h1>
      <button onClick={handleLogout}>SIGN OUT</button>
    </div>
  );
};
