import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ratings } from '../reducers/ratings';
import { API_URL } from '../utils/urls';
import styled from 'styled-components';
import moment from 'moment';

import { AddRating } from './AddRating';
import { SearchBar } from './SearchBar';

import { RatingCardComponent } from './RatingCardComponent';

import {
  Button,
  SearchAndSortContainer,
  RatingContainer,
  RatingCard,
  RatingText,
  Question,
  Answer,
  DateAndUser,
} from '../styles/Styles';

const ProfileImage = styled.div`
  height: 40px;
  width: 40px;
  background: #161616;
  border-radius: 50%;
`;

export const SortingSelect = props => {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState('ratings');
  const [ratingInput, setRatingInput] = useState([]);

  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const rating = useSelector(store => store.ratings.items);
  const username = useSelector(store => store.user.username);
  console.log(rating);

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

  useEffect(() => {
    const sortArray = type => {
      const types = {
        highToLow: 'highToLow',
        lowToHigh: 'lowToHigh',
      };
      const sortProperty = types[type];
      const sorted = [...rating].sort(
        (a, b) => b[sortProperty] - a[sortProperty]
      );
      setData(sorted);
    };
    sortArray(sortType);
  }, [sortType, rating]);

  // this deletes a rating
  const onDeleteRating = ratingId => {
    window.location.reload(true);
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        dispatch(ratings.actions.setRating(data.response));
      });
  };

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
    if (selectCategory === 'Other') {
      return 'green';
    }
  };

  const backgroundImage = selectCategory => {
    if (selectCategory === 'Pizza') {
      return 'url(https://i.postimg.cc/6qCg1BMm/16399430961571183077-128-1.png)';
    }
    if (selectCategory === 'Hamburger') {
      return 'url(https://i.postimg.cc/DfPfphRG/6190425961595501135-128.png)';
    }
    if (selectCategory === 'Sushi') {
      return 'url(https://i.postimg.cc/jjFyBN9D/8007019041538117462-128.png)';
    }
    if (selectCategory === 'Pasta') {
      return 'url(https://i.postimg.cc/fRknMQyJ/17811043341538117461-128-1.png)';
    }
    if (selectCategory === 'Other') {
      return 'url(https://i.postimg.cc/KjbqYjSr/16538534611595501138-128-1.png)';
    }
  };

  return (
    <div>
      <AddRating canWrite={props.canWrite} />
      <SearchAndSortContainer>
        {/* <SearchBar /> */}

        <select onChange={e => setSortType(e.target.value)}>
          <option value='' defaultValue disabled>
            Choose here
          </option>
          <option value='highToLow'>highest to lowest</option>
          <option value='lowToHigh'>lowest to highest</option>
        </select>
      </SearchAndSortContainer>

      <RatingContainer>
        {rating &&
          rating.map(item => (
            <div key={item._id}>
              {/* <FoodImage
                src='https://postimg.cc/Mnd0YKDx'
                alt='fast food'
              ></FoodImage> */}
              <RatingCardComponent item={item} />
            </div>
          ))}

        {!rating && <div>No ratings to show</div>}
      </RatingContainer>
    </div>
  );
};
