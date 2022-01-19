import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';

// signed in content, first page you see
export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  //   // if there is no accessToken then redirect to login
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch('http://localhost:8080/main', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(ratings.actions.addRating(data.response));
          dispatch(ratings.actions.setError(null));
        } else {
          dispatch(ratings.actions.addRating([]));
          dispatch(ratings.actions.setError(data.response));
        }
      });
  }, [accessToken, dispatch]);

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };

  return (
    <div>
      <Link to='/user'>To your profile</Link>
      <h1>Hello world</h1>;<button onClick={handleLogout}>SIGN OUT</button>
    </div>
  );
};
