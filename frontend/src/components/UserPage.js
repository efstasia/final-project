import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { ratings } from '../reducers/ratings';
const Title = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
`;

const RatingContainer = styled.div`
  border: 2px solid black;
  width: 50%;
  margin: auto;
  text-align: center;
`;

export const UserPage = () => {
  const [rating, setRating] = useState([]);
  const [deleteRating, setDeleteRating] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [profileImageData, setprofileImageData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageInput = useRef();

  const ratingItems = useSelector(store => store.ratings.items);
  const accessToken = useSelector(store => store.user.accessToken);
  const userId = useSelector(store => store.user.userId);
  const email = useSelector(store => store.user.email);
  const username = useSelector(store => store.user.username);
  const firstName = useSelector(store => store.user.firstName);
  const lastName = useSelector(store => store.user.lastName);

  console.log('RATING ITEMS', ratingItems);

  const { profileImageUrl } = profileImageData;

  //   // if there is no accessToken then redirect to login

  // --- fetches the ratings. GET method --- //
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(`http://localhost:8080/feed/${userId}`, options) // needs ${userId}
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // dispatch(ratings.actions.setRating(data.response));
          // dispatch(ratings.actions.setError(null));

          setRating(data.response);
          console.log(data.response);
        } else {
          // dispatch(ratings.actions.setRating([]));
        }
        console.log(data.response);
      });
  }, [dispatch, accessToken, userId]);

  // -- upload images -- //
  const uploadImage = () => {
    const formData = new FormData();
    formData.append('image', imageInput.current.files[0]);

    fetch('http://localhost:8080/userpage/image', {
      method: 'POST',
      headers: {
        Authorization: accessToken,
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(
            'Oops! Choose a picture first! (formats: png/jpg/jpeg)'
          );
        }
        return res.json();
      })
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const onDeleteUserRating = userRatingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/feed/${userRatingId}`, options)
      .then(res => res.json())
      .then(data => {
        const remainingRatings = deleteRating.filter(
          rate => rate._id !== data._id
        );
        return remainingRatings;
      });
  };

  // --- getting the user info -- //
  return (
    <div>
      <Title>Welcome, {firstName}! This is your profile.</Title>
      <RatingContainer>
        <div>
          <label htmlFor='profilepic-button'>
            {profileImageUrl ? (
              <img src={`${profileImageUrl}`} alt='profile-pic' />
            ) : (
              <img src='eddorviking.png' alt='robot' />
            )}
          </label>
          <button type='submit' onClick={uploadImage}>
            upload
          </button>
        </div>
        <p>USERNAME: {username}</p>
        <p>EMAIL: {email}</p>
        <p>FIRSTNAME: {firstName}</p>
        <p>LASTNAME: {lastName}</p>
      </RatingContainer>

      <RatingContainer>
        {rating &&
          rating.map(item => (
            <div key={item._id}>
              <p>
                RESTAURANT NAME: {item.restaurantName} RATING TEXT:
                {item.ratingText} RATING: {item.selectRating} CATEGORY:{' '}
                {item.selectCategory} RECOMMEND? {item.radioInput}
              </p>
              <button onClick={() => onDeleteUserRating(item._id)}>
                DELETE
              </button>
            </div>
          ))}
      </RatingContainer>
    </div>
  );
};
