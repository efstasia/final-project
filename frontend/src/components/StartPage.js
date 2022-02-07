import React from 'react';
import { Link } from 'react-router-dom';
import hamburger from '../images/hamburger.jpg';
import pasta from '../images/pasta.jpg';
import neon from '../images/neon.jpg';

import { StartPageContainer, Button } from '../styles/Styles';

// add the info about the website here
export const StartPage = () => {
  return (
    <StartPageContainer>
      <div className='parent'>
        <div className='div1'>
          <img src={hamburger} alt='hamburger'></img>
        </div>
        <div className='div2'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            <Button>
              <Link className='signup-link' to='/signup'>
                SIGNUP/LOGIN
              </Link>
            </Button>
          </p>
        </div>
        <div className='div3'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className='div4'>
          <img src={neon} alt='neon sign' />
        </div>

        {/* add info about page here */}
      </div>
    </StartPageContainer>
  );
};
