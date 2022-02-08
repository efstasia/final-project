import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from './RatingCardComponent';
import darkbackground from '../images/darkbackground.jpg';
import darkpaint from '../images/darkpaint.jpg';

import {
  Button,
  Form,
  ProfileContainer,
  EditImageDiv,
  Title,
  UserpageContainer,
  RatingHeaderText,
} from '../styles/Styles';

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
  const [editImage, setEditImage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const imageInput = useRef();

  const ratingItems = useSelector(store => store.ratings.items);
  const accessToken = useSelector(store => store.user.accessToken);
  const userId = useSelector(store => store.user.userId);
  const email = useSelector(store => store.user.email);
  const username = useSelector(store => store.user.username);
  const firstName = useSelector(store => store.user.firstName);
  const lastName = useSelector(store => store.user.lastName);
  const image = useSelector(store => store.user.image);
  const role = useSelector(store => store.user.role);
  console.log(role);

  const [userInfoEdit, setUserInfoEdit] = useState({
    username: username,
    firstName: firstName,
    lastName: lastName,
  });

  console.log('RATING ITEMS', ratingItems);
  console.log('RATING MAP', rating);
  console.log(userId);

  const dummyImage =
    'https://i.postimg.cc/MpzWNG5g/87409506116276584393773-128.png';

  const handleEdit = () => {
    setCanWrite(true);
  };

  const handleEditClose = () => {
    setCanWrite(false);
  };

  const handleImageUpload = () => {
    setEditImage(true);
  };

  const handleImageUploadClose = () => {
    setEditImage(false);
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

    fetch(`http://localhost:8080/userpage/${id}/image`, {
      method: 'POST',
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
      .then(data => dispatch(user.actions.setImage(data.response.imageUrl)))

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
        dispatch(ratings.actions.deleteRating(data.response));
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
      <ProfileContainer>
        <div className='grid-wrapper'>
          <div className='image-grid'>
            <img src={image || dummyImage} alt='profile-pic' />

            {!editImage && (
              <Button onClick={handleImageUpload}>CHANGE IMAGE</Button>
            )}
          </div>
          <div className='info-grid'>
            <p>USERNAME | {username}</p>
            <p>EMAIL | {email}</p>
            <p>FIRSTNAME | {firstName}</p>
            <p>LASTNAME | {lastName}</p>
            {!canWrite && <Button onClick={handleEdit}>EDIT INFO</Button>}
          </div>
        </div>
      </ProfileContainer>
      {editImage && (
        <EditImageDiv>
          <img src={image || dummyImage} alt='profile-pic' />
          <label htmlFor='profilepic-button'>
            <input type='file' ref={imageInput} />
          </label>
          <Button style={{ top: '23%' }} type='submit' onClick={uploadImage}>
            SAVE
          </Button>
          <Button
            style={{
              borderRadius: '50%',
              width: '60px',
              height: '60px',

              position: 'absolute',
              left: '82%',
              bottom: '75%',
            }}
            onClick={handleImageUploadClose}
          >
            <i className='fas fa-times'></i>
          </Button>
        </EditImageDiv>
      )}
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
      <RatingHeaderText>YOUR PERSONAL RATINGS</RatingHeaderText>
      <UserpageContainer>
        <div className='inner-div'>
          {rating &&
            rating.map(item => (
              <div className='inner-card' key={item._id}>
                <RatingCardComponent item={item} />
                <Button
                  className='delete-userpage-button'
                  onClick={() => onDeleteUserRating(item._id)}
                >
                  DELETE
                </Button>
              </div>
            ))}
        </div>
      </UserpageContainer>
    </div>
  );
};
