import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import { API_URL } from '../utils/urls';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';

import { SortingSelect } from './SortingSelect';
import { AddRating } from './AddRating';

import { RatingContainer, SearchAndSortContainer } from '../styles/Styles';

const FoodImage = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`;

// signed in content, first page you see
export const SearchBar = props => {
  const [restaurantName, setRestaurantName] = useState([]);
  const [validationError, setValidationError] = useState(null); // setValidationErrors needs to be connected to backend error msg

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const rating = useSelector(store => store.ratings.items);

  console.log(rating);
  // console.log('USER ID', userId);

  // if there is no accessToken then redirect to login
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // this handles the POSTING of ratings

  // const onSearchRestaurant = event => {
  //   fetch(`http://localhost:8080/restaurant?restaurantName=${searchRestaurant}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       dispatch(ratings.actions.setRating(data.response));
  //     });
  //   // setSearchRestaurant(event.target.value);
  // };

  const onSearchInput = input => {
    let matches = [];
    if (input.length > 0) {
      matches = rating.filter(item => {
        const regex = new RegExp(`${input}`, 'gi'); // Case insensitive
        return item.restaurantName.match(regex);
      });
    }
    setRestaurantName(matches);
    // setInput(input);
  };

  // handles  the GETTING of rating to show
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL('feed'), options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.setRating(data.response));
        dispatch(ratings.actions.setError(null));
        //  dispatch(user.actions.setUsername(data.response.username));
        console.log(data.response);
      });
  }, [dispatch, accessToken]);

  console.log('restaurant NAME', restaurantName);
  return (
    <div>
      <AddRating canWrite={props.canWrite} />
      <SearchAndSortContainer>
        <label htmlFor='searchbar'>SEARCH</label>
        <input
          type='text'
          id='searchbar'
          placeholder='search'
          onChange={e => onSearchInput(e.target.value)}
        />
      </SearchAndSortContainer>
      <RatingContainer>
        {rating && restaurantName.length === 0
          ? rating.map(item => (
              <div key={item._id}>
                <RatingCardComponent item={item} />
              </div>
            ))
          : restaurantName.map(item => (
              <div key={item._id}>
                <RatingCardComponent item={item} />
              </div>
            ))}
      </RatingContainer>

      {/* <SortingSelect /> */}

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}
    </div>
  );
};
