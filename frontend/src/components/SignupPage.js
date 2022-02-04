import React, { useState, useEffect } from 'react';
import { useDispatch, batch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { user } from '../reducers/user';
import { Collapse } from '@chakra-ui/core';
import food2 from '../videos/food.mp4';

import { SignupContainer, PageWrapper, Button } from '../styles/Styles';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [usernameSignin, setUsernameSignin] = useState('');
  const [passwordSignin, setPasswordSignin] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(store => store.user.accessToken);

  // this handles the SIGN IN
  useEffect(() => {
    if (accessToken) {
      navigate('/feed');
    }
  }, [accessToken, navigate]);

  const onSignInSubmit = event => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameSignin,
        password: passwordSignin,
      }),
    };

    fetch('http://localhost:8080/signin', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            console.log(data.response);
            dispatch(user.actions.setUserId(data.response.userId));

            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setFirstName(data.response.firstName));
            dispatch(user.actions.setLastName(data.response.lastName));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setError(null));
          });
          console.log(data.response.userId);
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));

            setValidationError(data.message);
          });
        }
      });
  };

  // this handles the SIGN UP

  const onFormSubmit = event => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    };
    fetch('http://localhost:8080/signup', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            console.log(data.response);
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setFirstName(data.response.firstName));
            dispatch(user.actions.setLastName(data.response.lastName));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setError(null));
          });
          Swal.fire({
            icon: 'success',
            title: 'Yay',
            text: "You're now a member",
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setFirstName(null));
            dispatch(user.actions.setLastName(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setEmail(null));
            dispatch(user.actions.setError(data.response));
            setValidationError(data.message);
          });
          console.log(data);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong',
          });
        }
      });
  };

  return (
    <PageWrapper>
      <div>
        <video loop muted autoPlay>
          <source src={food2} type='video/mp4' />
        </video>
      </div>
      <SignupContainer>
        <form onSubmit={onFormSubmit}>
          <fieldset>
            <legend>signup</legend>
            <label htmlFor='email'>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              id='email'
            />
            <label htmlFor='username'>Username</label>
            <input
              value={username}
              id='username'
              onChange={e => setUsername(e.target.value)}
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              value={password}
              id='password'
              onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor='firstName'>First name</label>
            <input
              value={firstName}
              id='firstName'
              onChange={e => setFirstName(e.target.value)}
            />
            <label htmlFor='lastName'>Last name</label>
            <input
              value={lastName}
              id='lastName'
              onChange={e => setLastName(e.target.value)}
            />
            <button type='submit'>submit</button>
          </fieldset>
        </form>

        {/* {validationError !== null && (
        <p style={{ fontSize: '21px', color: 'red' }}>{validationError}</p>
      )} */}
        {/* <h2>already a member? SIGN IN</h2> */}
        <Button
          style={{ marginTop: '20px' }}
          variantColor='blue'
          onClick={handleToggle}
        >
          already a member?
        </Button>
        <Collapse mt={4} isOpen={show}>
          <form onSubmit={onSignInSubmit}>
            <fieldset>
              <legend>sign in</legend>
              <label htmlFor='usernameSignup'>Username</label>
              <input
                value={usernameSignin}
                id='usernameSignup'
                onChange={e => setUsernameSignin(e.target.value)}
              />
              <label htmlFor='passwordSignin'>Password</label>
              <input
                type='password'
                value={passwordSignin}
                id='passwordSign'
                onChange={e => setPasswordSignin(e.target.value)}
              />
              <button type='submit'>SIGN IN</button>
            </fieldset>
          </form>
        </Collapse>
      </SignupContainer>
    </PageWrapper>
  );
};
export default SignupPage;
