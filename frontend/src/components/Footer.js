import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  height: 100px;
  background-color: black;
  position: relative;
  bottom: 0;
  left: 0;
`;

export const Footer = () => {
  return (
    <div>
      <FooterContainer>this is a footer</FooterContainer>
    </div>
  );
};
