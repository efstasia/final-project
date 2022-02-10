import React from 'react';
import { func, string } from 'prop-types';
import styled from 'styled-components';
const Button = styled.button`
  background: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.6rem;
  font-family: 'Fredoka One', cursive;
  position: relative;
  left: 32%;
  top: 30%;
  margin-top: 5px;

  @media (max-width: 768px) {
    left: 10%;
  }

  @media (max-width: 481px) {
    display: none;
  }
`;
const Toggle = ({ theme, toggleTheme }) => {
  return <Button onClick={toggleTheme}>Switch Theme</Button>;
};
Toggle.propTypes = {
  theme: string.isRequired,
  toggleTheme: func.isRequired,
};
export default Toggle;
