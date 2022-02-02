import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import ScrollToTop from 'react-scroll-to-top';

import { API_URL } from '../utils/urls';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';

import { AddRating } from './AddRating';

import { RatingContainer, SearchAndSortContainer } from '../styles/Styles';

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

  // this handles the searching of ratings //
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

  // if (data.length > 0) {
  //   return (
  //     <div>
  //       <ScrollToTop smooth />
  //       <AddRating canWrite={props.canWrite} />
  //       <SearchAndSortContainer>
  //         <label htmlFor='searchbar'>SEARCH</label>
  //         <input
  //           type='text'
  //           id='searchbar'
  //           placeholder='search'
  //           onChange={e => onSearchInput(e.target.value)}
  //         />
  //         <select onChange={event => setSortType(event.target.value)}>
  //           <option value='all' defaultValue>
  //             all
  //           </option>
  //           <option value='highToLow'>high to low</option>
  //           <option value='lowToHigh'>low to high</option>
  //           <option></option>
  //         </select>
  //         {/* <SortingSelect /> */}
  //       </SearchAndSortContainer>
  //       <RatingContainer>
  //         {data &&
  //           data.map(item => (
  //             <div key={item._id}>
  //               <RatingCardComponent item={item} />
  //             </div>
  //           ))}
  //       </RatingContainer>
  //     </div>
  //   );
  // } else if (data.length === 0) {
  return (
    <div>
      <ScrollToTop smooth />
      <AddRating canWrite={props.canWrite} />
      <SearchAndSortContainer>
        <label htmlFor='searchbar'>SEARCH</label>
        <input
          type='text'
          id='searchbar'
          placeholder='search'
          onChange={e => onSearchInput(e.target.value)}
        />
        SORT
        <select onChange={event => setSortType(event.target.value)}>
          <option value='all' defaultValue>
            all
          </option>
          <option value='highToLow'>high to low</option>
          <option value='lowToHigh'>low to high</option>
          <option></option>
        </select>
      </SearchAndSortContainer>
      <RatingContainer>
        {data && restaurantName.length === 0
          ? data.map(item => (
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

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}
    </div>
  );
};
