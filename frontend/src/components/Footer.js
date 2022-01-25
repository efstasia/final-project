import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  height: 5%;
  width: 100%;
  background-color: #161616;
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  text-align: center;
`;

export const Footer = () => {
  return (
    <div>
      <FooterContainer>this is a footer</FooterContainer>
    </div>
  );
};
