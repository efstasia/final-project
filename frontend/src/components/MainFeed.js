import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import ScrollToTop from 'react-scroll-to-top';
import ShowMore from 'react-show-more-button';

import { API_URL } from '../utils/urls';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';

import { AddRating } from './AddRating';

import {
  RatingContainer,
  SearchAndSortContainer,
  PageContainer,
  Button,
  LoadMoreContainer,
} from '../styles/Styles';

const FoodImage = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`;

// signed in content, first page you see
export const MainFeed = props => {
  const [restaurantName, setRestaurantName] = useState([]);
  const [validationError, setValidationError] = useState(null); // setValidationErrors needs to be connected to backend error msg
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState('ratings');
  const [mapCount, setMapCount] = useState(9);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const rating = useSelector(store => store.ratings.items);
  const role = useSelector(store => store.user.role);

  console.log(rating);
  // console.log('USER ID', userId);

  const getMoreRatings = () => {
    setMapCount(data.length);
  };

  // if there is no accessToken then redirect to login
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // this handles the searching of ratings //
  const onSearchInput = input => {
    let matches = [];
    if (input.length >= 0) {
      matches = rating.filter(item => {
        const regex = new RegExp(`${input}`, 'gi'); // Case insensitive
        return item.restaurantName.match(regex);
      });
    }
    setData(matches);
  };

  // handles  the GETTING of rating to show //
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
        dispatch(ratings.actions.setItems(data.response));
        dispatch(ratings.actions.setError(null));
        //  dispatch(user.actions.setUsername(data.response.username));
        console.log(data.response);
        setData(data.response);
      });
  }, [dispatch, accessToken]);

  // this sorts the ratings //
  useEffect(() => {
    if (sortType === 'highToLow') {
      setData([...rating].sort((a, b) => b.selectRating - a.selectRating));
    } else if (sortType === 'lowToHigh') {
      setData([...rating].sort((a, b) => a.selectRating - b.selectRating));
    } else if (sortType === 'all') {
      setData(rating);
    }
  }, [sortType, rating]);

  console.log('restaurant NAME', restaurantName);

  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.deleteRating(data.response.items));
        console.log(data.response);
      });
  };

  return (
    <div>
      <ScrollToTop smooth />
      <AddRating canWrite={props.canWrite} />
      <SearchAndSortContainer>
        <label htmlFor='searchbar'></label>
        <input
          type='text'
          id='searchbar'
          placeholder='search for a restaurant'
          onChange={e => onSearchInput(e.target.value)}
        />

        <select onChange={event => setSortType(event.target.value)}>
          <option value='all' defaultValue>
            sort by rating
          </option>
          <option value='highToLow'>high to low</option>
          <option value='lowToHigh'>low to high</option>
          <option></option>
        </select>
      </SearchAndSortContainer>

      {/* <PageContainer> */}
      <RatingContainer>
        {data &&
          data.length >= 0 &&
          data.slice(0, mapCount).map(item => (
            <div key={item._id}>
              <RatingCardComponent item={item} />
              {role === 'Admin' ? (
                <Button
                  className='add-button'
                  style={{
                    borderRadius: '0',
                    width: '50%',
                    top: '-10%',
                    margin: '5px auto',
                    display: 'block',
                  }}
                  onClick={() => onDeleteRating(item._id)}
                >
                  DELETE
                </Button>
              ) : (
                ''
              )}
            </div>
          ))}
      </RatingContainer>
      <LoadMoreContainer>
        <Button className='load-more-button' onClick={getMoreRatings}>
          LOAD MORE
        </Button>
      </LoadMoreContainer>
      {/* </PageContainer> */}

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}
    </div>
  );
};
