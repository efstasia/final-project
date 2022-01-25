import React from 'react';
import { bool } from 'prop-types';
import { useDispatch } from 'react-redux';
import { StyledMenu } from './Menu.styled';

import { user } from '../../reducers/user';

export const Menu = ({ open }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };

  return (
    <>
      <StyledMenu open={open}>
        <a href='/feed'>Feed</a>
        <a href='/userpage'>Profile</a>
        <button onClick={handleLogout}>SIGN OUT</button>
      </StyledMenu>
    </>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};
