import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';

import { Button, Form } from '../styles/Styles';

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
  const [password, setPassword] = useState('');
  const [canWrite, setCanWrite] = useState(false);

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

  const [userInfoEdit, setUserInfoEdit] = useState({
    username: username,
    firstName: firstName,
    lastName: lastName,
  });

  console.log('RATING ITEMS', ratingItems);
  console.log('RATING MAP', rating);
  console.log(userId);

  const { profileImageUrl } = profileImageData;

  const handleEdit = () => {
    setCanWrite(true);
  };

  const handleEditClose = () => {
    setCanWrite(false);
  };

  // --- fetches the ratings. GET method --- //
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(`http://localhost:8080/userpage/${userId}`, options) // needs ${userId}
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(ratings.actions.setItems(data.response));
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

  const onChangeUserInfo = event => {
    event.preventDefault();
    const options = {
      method: 'PATCH',
      headers: {
        // Authorization: accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userInfoEdit }),
    };

    fetch(`http://localhost:8080/userpage/${userId}`, options)
      .then(res => res.json())
      .then(data => {
        setUserInfoEdit(data.response);
        if (data.success) {
          dispatch(user.actions.setFirstName(data.response.firstName));
          dispatch(user.actions.setLastName(data.response.lastName));
          dispatch(user.actions.setUsername(data.response.username));
          dispatch(user.actions.setError(null));
        } else {
          dispatch(user.actions.setFirstName(null));
          dispatch(user.actions.setLastName(null));
          dispatch(user.actions.setUsername(null));
          dispatch(user.actions.setError(data.response));
        }
        console.log(data.response);
        console.log(userId);

        // console.log(userProfile)
      });
    setCanWrite(false);
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
              <img
                src='https://i.postimg.cc/MpzWNG5g/87409506116276584393773-128.png'
                alt='robot'
              />
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
        {!canWrite && <Button onClick={handleEdit}>EDIT INFO</Button>}
      </RatingContainer>
      {canWrite && (
        <Form onSubmit={onChangeUserInfo}>
          <label htmlFor='username'>change username</label>
          <input
            id='username'
            type='text'
            defaultValue={userInfoEdit.username}
            onChange={event =>
              setUserInfoEdit({ ...userInfoEdit, username: event.target.value })
            }
          />
          <label htmlFor='first-name'>change first name</label>
          <input
            type='text'
            id='first-name'
            defaultValue={userInfoEdit.firstName}
            onChange={event =>
              setUserInfoEdit({
                ...userInfoEdit,
                firstName: event.target.value,
              })
            }
          />
          <label htmlFor='last-name'>last name</label>
          <input
            id='last-name'
            type='text'
            defaultValue={userInfoEdit.lastName}
            onChange={event =>
              setUserInfoEdit({ ...userInfoEdit, lastName: event.target.value })
            }
          />
          <Button type='submit' onClick={onChangeUserInfo}>
            SUBMIT
          </Button>
          <Button onClick={handleEditClose}>CLOSE</Button>
        </Form>
      )}

      <RatingContainer>
        {rating &&
          rating.map(item => (
            <div key={item._id}>
              <RatingCardComponent item={item} />
              {/* <Button onClick={() => onDeleteUserRating(item._id)}>
                DELETE
              </Button> */}
            </div>
          ))}
      </RatingContainer>
    </div>
  );
};
