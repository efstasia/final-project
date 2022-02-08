import React from 'react';
import { HeaderContainer } from '../styles/Styles';
import Toggle from './Toggler';

export const Header = ({ theme, themeToggler }) => {
  return (
    <HeaderContainer>
      <img
        src='https://i.postimg.cc/LXVg21Qk/message-square-outline.png'
        alt='logo'
      />
      <h1>| MINECHIES</h1>

      <Toggle theme={theme} toggleTheme={themeToggler} />
    </HeaderContainer>
  );
};
