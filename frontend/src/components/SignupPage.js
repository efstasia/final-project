import React, { useState, useEffect } from 'react';
import { useDispatch, batch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { user } from '../reducers/user';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [usernameSignin, setUsernameSignin] = useState('');
  const [passwordSignin, setPasswordSignin] = useState('');

  const [validationError, setValidationError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(store => store.user.accessToken);

  // this handles the SIGN IN
  useEffect(() => {
    if (accessToken) {
      navigate('/main');
    }
  }, [accessToken, navigate]);

  const onSignInSubmit = event => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    };

    fetch('http://localhost:8080/signin', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
            localStorage.setItem(
              'user',
              JSON.stringify({
                userId: data.response.userId,
                username: data.response.username,
                accessToken: data.response.accessToken,
              })
            );
          });
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
    //   gå igenom när jag inte har migrän
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
            console.log(data);
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setFirstName(data.response.firstName));
            dispatch(user.actions.setLastName(data.response.lastName));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setError(null));
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
        }
      });
  };

  return (
    <div>
      <form onSubmit={onFormSubmit}>
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
      </form>
      {validationError !== null && (
        <p style={{ fontSize: '21px', color: 'red' }}>{validationError}</p>
      )}

      <h2>already a member? SIGN IN</h2>
      <form onSubmit={onSignInSubmit}>
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
      </form>
    </div>
  );
};
export default SignupPage;
