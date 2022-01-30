import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';
import { SortingSelect } from './SortingSelect';

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
  width: 70%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`;

const RatingText = styled.div`
  border: 2px solid black;
`;

const ProfileImage = styled.div`
  height: 40px;
  width: 40px;
  background: #161616;
  border-radius: 50%;
`;

const FoodImage = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`;

// signed in content, first page you see
export const MainPage = () => {
  const [validationError, setValidationError] = useState(null); // setValidationErrors needs to be connected to backend error msg
  const [ratingInput, setRatingInput] = useState([]);
  const [canWrite, setCanWrite] = useState(false);
  const [input, setInput] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [selectRating, setSelectRating] = useState(0);
  const [selectCategory, setSelectCategory] = useState('');
  const [radioInput, setRadioInput] = useState('');
  const [searchRestaurant, setSearchRestaurant] = useState('');
  //const [username, setUsername] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const userId = useSelector(store => store.user.userId);
  const rating = useSelector(store => store.ratings.items);
  const username = useSelector(store => store.user.username);
  console.log(rating);
  // console.log('USER ID', userId);

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

  // this handles the POSTING of ratings
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

  const onSearchRestaurant = () => {
    fetch(`http://localhost:8080/restaurant?restaurantName=${searchRestaurant}`)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.setRating(data.response));
        setSearchRestaurant('');
      });
  };

  // this deletes a rating
  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        const remainingRatings = rating.filter(rate => rate._id !== data._id); // need something similar in search function?
        return setRatingInput(remainingRatings); // this deletes the rating WITHOUT refresh
      });
  };

  // handles  the GETTING of rating to show
  // useEffect(() => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       Authorization: accessToken,
  //     },
  //   };

  //   fetch('http://localhost:8080/feed', options)
  //     .then(res => res.json())
  //     .then(data => {
  //       dispatch(ratings.actions.setRating(data.response));
  //       dispatch(ratings.actions.setError(null));
  //       //  dispatch(user.actions.setUsername(data.response.username));

  //       console.log(data.response);
  //     });
  // }, [dispatch, accessToken]);

  // const sortAsc = rating.sort((a, b) => {
  //   return a.items > b.items ? 1 : -1;
  // });

  const backgroundColor = selectCategory => {
    if (selectCategory === 'Pizza') {
      return 'blue';
    }
    if (selectCategory === 'Hamburger') {
      return 'pink';
    }
    if (selectCategory === 'Sushi') {
      return 'orange';
    }
    if (selectCategory === 'Pasta') {
      return 'purple';
    }
  };

  return (
    <div>
      {/* <Link to='/userpage'>To your profile</Link> */}
      <div>
        {!canWrite && (
          <button onClick={() => handleWriteRating()}>ADD RATING</button>
        )}
        <label htmlFor='searchbar'>SEARCH</label>
        <input
          type='text'
          id='searchbar'
          placeholder='search'
          onChange={event => setSearchRestaurant(event.target.value)}
        />

        <button
          onClick={() => onSearchRestaurant(restaurantName)}
          type='submit'
        >
          search
        </button>
        <SortingSelect />
        {/* {rating.map(sort => (
          <div>{sort.selectRating}</div>
        ))} */}
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
        {rating &&
          rating.map(item => (
            <div key={item._id}>
              {/* <FoodImage
                src='https://postimg.cc/Mnd0YKDx'
                alt='fast food'
              ></FoodImage> */}
              <RatingText>
                <div
                  style={{
                    height: '30px',

                    background: backgroundColor(item.selectCategory),
                  }}
                ></div>
                <p>RESTAURANT NAME: {item.restaurantName}</p>
                <p>
                  RATING TEXT:
                  {item.ratingText}
                </p>
                <p>RATING: {item.selectRating} </p>
                <p>
                  CATEGORY:
                  {item.selectCategory}
                </p>
                <p>RECOMMEND? {item.radioInput}</p>
                <p> {moment(item.createdAt).format('LL')}</p>
                <p>
                  <ProfileImage></ProfileImage>
                  {username}
                </p>
                <button onClick={() => onDeleteRating(item._id)}>DELETE</button>
              </RatingText>
            </div>
          ))}

        {!rating && <div>No ratings to show</div>}
      </RatingContainer>

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}

      <h1>Hello world, this is the signed in content</h1>
    </div>
  );
};
