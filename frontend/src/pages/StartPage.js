import React from 'react';
import { Link } from 'react-router-dom';
import hamburger from '../images/hamburger.jpg';
import neon from '../images/neon.jpg';

import { StartPageContainer, Button } from '../styles/Styles';

export const StartPage = () => {
  return (
    <StartPageContainer>
      <div className='parent'>
        <div className='div1'>
          <img src={hamburger} alt='hamburger'></img>
        </div>
        <div className='div2'>
          <p>
            Welcome to minechies. This a website where we can add our own
            ratings, or, minchies as we like to call them. We can also look at
            the feed to see what other people have enjoyed, or not enjoyed,
            eating.
            <Button>
              <Link className='signup-link' to='/signup'>
                SIGNUP/LOGIN
              </Link>
            </Button>
          </p>
        </div>
        <div className='div3'>
          <p>
            This is an application created as a final project in the Technigo
            bootcamp. It's creators are Sofia Wallerberg & Eddie Lundgren. This
            is an idea that grew from a common fondness of burgers and being
            tired of having to go through a hundred notes on your phone to find
            and add a rating or comment about food you've eaten or a place you
            wish to avoid. We all know that food is life and you shouldn't be
            going through life eating bad food.
          </p>
        </div>
        <div className='div4'>
          <img src={neon} alt='neon sign' />
        </div>
      </div>
    </StartPageContainer>
  );
};
