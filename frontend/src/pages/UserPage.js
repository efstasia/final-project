import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';
import { RatingCardComponent } from '../components/RatingCardComponent';

import { API_URL } from '../utils/urls';

import {
  Button,
  Form,
  ProfileContainer,
  EditImageDiv,
  UserpageTitle,
  UserpageContainer,
  RatingHeaderText,
} from '../styles/Styles';

export const UserPage = () => {
  const [canWrite, setCanWrite] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const imageInput = useRef();

  const accessToken = useSelector(store => store.user.accessToken);
  const email = useSelector(store => store.user.email);
  const username = useSelector(store => store.user.username);
  const firstName = useSelector(store => store.user.firstName);
  const lastName = useSelector(store => store.user.lastName);
  const image = useSelector(store => store.user.image);
  const rating = useSelector(store => store.ratings.items);

  const [userInfoEdit, setUserInfoEdit] = useState({
    username: username,
    firstName: firstName,
    lastName: lastName,
  });

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

    fetch(API_URL(`userpage/${userId}`), options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.setItems(data.response));
        dispatch(ratings.actions.setError(null));
      });
  }, [dispatch, accessToken, userId]);

  // -- upload images -- //
  const uploadImage = () => {
    const formData = new FormData();
    formData.append('image', imageInput.current.files[0]);

    fetch(API_URL(`userpage/${userId}/image`), {
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
      .then(data => dispatch(user.actions.setImage(data.response.imageUrl)));
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // this deletes the ratings
  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(API_URL(`feed/${ratingId}`), options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.deleteRating(data._id));
      });
  };

  // this fetch patches the user info
  const onChangeUserInfo = event => {
    event.preventDefault();
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userInfoEdit }),
    };

    fetch(API_URL(`userpage/${userId}`), options)
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
      });
    setCanWrite(false);
  };

  // --- getting the user info -- //
  return (
    <div>
      <UserpageTitle>Welcome, {firstName}! This is your profile.</UserpageTitle>
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
          <Button className='closeImageUpload' onClick={handleImageUploadClose}>
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
                  onClick={() => onDeleteRating(item._id)}
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
