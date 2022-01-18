import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { user } from '../reducers/user';

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

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };

  return (
    <div>
      <h1>Hello world</h1>;<button onClick={handleLogout}>SIGN OUT</button>
    </div>
  );
};
