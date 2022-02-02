import React from 'react';
import { bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { StyledMenu } from './Menu.styled';

import { Button, LogOutButtonContainer } from '../../styles/Styles';

import { user } from '../../reducers/user';

export const Menu = ({ open }) => {
  const dispatch = useDispatch();
  const userId = useSelector(store => store.user.userId);

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };

  return (
    <>
      <StyledMenu open={open}>
        <a href='/feed'>Feed</a>
        <a href={`/userpage/${userId}`}>Profile</a>
        <LogOutButtonContainer>
          <Button onClick={handleLogout}>SIGN OUT</Button>
        </LogOutButtonContainer>
      </StyledMenu>
    </>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};
