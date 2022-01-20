import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  height: 150px;
  color: white;
  background: #161616;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
`;

export const Header = () => {
  return <HeaderContainer>HEADER</HeaderContainer>;
};
