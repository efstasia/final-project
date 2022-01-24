import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';

export const Menu = ({ open }) => {
  return (
    <StyledMenu open={open}>
      <a href='/feed'>
        <span role='img' aria-label='price'>
          &#x1f4b8;
        </span>
        Pricing
      </a>
      <a href='/userpage'>
        <span role='img' aria-label='contact'>
          &#x1f4e9;
        </span>
        Contact
      </a>
    </StyledMenu>
  );
};
Menu.propTypes = {
  open: bool.isRequired,
};
