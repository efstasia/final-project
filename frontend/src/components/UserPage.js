import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { ratings } from '../reducers/ratings';

import styled from 'styled-components';

const RatingContainer = styled.div`
  border: 2px solid black;
  width: 50%;
  margin: auto;
`;

export const UserPage = () => {
  const [rating, setRating] = useState([]);
  const [deleteRating, setDeleteRating] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ratingItems = useSelector(store => store.ratings.items);
  const accessToken = useSelector(store => store.user.accessToken);
  const userId = useSelector(store => store.user.userId);
  //   // if there is no accessToken then redirect to login

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(`http://localhost:8080/userpage`, options) // needs ${userId}
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(ratings.actions.addRating(data.response));
          dispatch(ratings.actions.setError(null));

          setRating(data.response);
        } else {
          dispatch(ratings.actions.setRating([]));
        }
      });
  }, [accessToken, dispatch, userId]);
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const onDeleteUserRating = userRatingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/userpage/${userRatingId}`, options)
      .then(res => res.json())
      .then(data => {
        const remainingRatings = deleteRating.filter(
          rate => rate._id !== data._id
        ); // need something similar in search function?
        return setDeleteRating(remainingRatings); // this deletes the rating WITHOUT refresh
      });
  };
  return (
    <div>
      <Link to='/feed'>Back to feed</Link>
      <p>USER PAGE</p>
      <RatingContainer>
        {rating.map(item => (
          <div key={item._id}>
            <p>
              RESTAURANT NAME: {item.restaurantName} RATING TEXT:
              {item.ratingText} RATING: {item.selectRating} CATEGORY:{' '}
              {item.selectCategory} RECOMMEND? {item.radioInput}
            </p>
            <button onClick={() => onDeleteUserRating(item._id)}>DELETE</button>
          </div>
        ))}
      </RatingContainer>
    </div>
  );
};
