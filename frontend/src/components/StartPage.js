import React from 'react';
import { Link } from 'react-router-dom';

// add the info about the website here
export const StartPage = () => {
  return (
    <div>
      <h1>Start page</h1>
      <p>Already a member? otherwise sign up</p>
      <Link to='/signup'>Signup</Link>
    </div>
  );
};
