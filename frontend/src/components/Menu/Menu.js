import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';

export const Menu = ({ open }) => {
  return (
    <StyledMenu open={open}>
      <a href="/feed">Feed</a>
      <a href="/userpage">Profile</a>
    </StyledMenu>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};
