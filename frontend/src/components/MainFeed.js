import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';

import { API_URL } from '../utils/urls';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';

import { AddRating } from './AddRating';
import catmeme from '../images/catmeme.jpg';

import {
  Button,
  RatingContainer,
  SearchAndSortContainer,
  LoadMoreContainer,
  NoRatingDiv,
} from '../styles/Styles';

// signed in content, first page you see
export const MainFeed = props => {
  const [validationError, setValidationError] = useState(null); // setValidationErrors needs to be connected to backend error msg
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState('ratings');
  const [mapCount, setMapCount] = useState(9);
  const [input, setInput] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const rating = useSelector(store => store.ratings.items);
  const role = useSelector(store => store.user.role);

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
  const onRatingFilter = item => {
    const regex = new RegExp(input, 'gi'); // Case insensitive
    return item.restaurantName.match(regex);
  };

  const onRatingSort = (a, b) => {
    if (sortType === 'highToLow') {
      return b.selectRating - a.selectRating;
    } else if (sortType === 'lowToHigh') {
      return a.selectRating - b.selectRating;
    } else if (sortType === 'all') {
      return;
    }
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
        setData(data.response);
      });
  }, [dispatch, accessToken]);

  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.deleteRating(data._id));
      });
  };

  return (
    <div>
      <ScrollToTop smooth />

      <SearchAndSortContainer>
        <label htmlFor='searchbar'></label>
        <input
          type='text'
          id='searchbar'
          placeholder='search for a restaurant'
          onChange={e => setInput(e.target.value)}
          value={input}
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

      <RatingContainer>
        <AddRating canWrite={props.canWrite} />
        <div className={rating.length > 0 ? 'inner-div-feed' : 'no-ratings'}>
          {rating &&
            rating.length > 0 &&
            rating
              .slice(0, mapCount)
              .filter(onRatingFilter)
              .sort(onRatingSort)
              .map(item => (
                <div className='inner-card-feed' key={item._id}>
                  <RatingCardComponent item={item} />
                  {role === 'Admin' ? (
                    <Button
                      className='add-button'
                      onClick={() => onDeleteRating(item._id)}
                    >
                      DELETE
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              ))}
        </div>
        <NoRatingDiv>
          {rating.length === 0 && <img src={catmeme} alt='cat meme' />}
        </NoRatingDiv>
      </RatingContainer>
      <LoadMoreContainer>
        <Button className='load-more-button' onClick={getMoreRatings}>
          LOAD MORE
        </Button>
      </LoadMoreContainer>

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}
    </div>
  );
};
