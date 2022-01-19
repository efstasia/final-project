import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';

import { user } from '../reducers/user';
import { ratings } from '../reducers/ratings';

// signed in content, first page you see
export const MainPage = () => {
  const [validationError, setValidationError] = useState(null);
  const [rating, setRating] = useState([]);
  const [canWrite, setCanWrite] = useState(false);
  const [input, setInput] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const ratingItems = useSelector(store => store.ratings.setRating);

  const handleWriteRating = () => {
    setCanWrite(true);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
  };

  //   const addRating = () => {
  //     dispatch(ratings.actions.addRating(input));
  //     setInput('');
  //   };

  //   // if there is no accessToken then redirect to login
  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // this handles the POSTING of ratings, added wednesday evening
  const onRatingPost = event => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ratingText: input,
      }),
    };

    fetch('http://localhost:8080/ratings', options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(ratings.actions.addRating(data.response));
            dispatch(ratings.actions.setError(null));
            // navigate('/main');  unnecessary?
            setInput('');
            setCanWrite(false);
          });
        } else {
          batch(() => {
            dispatch(ratings.actions.addRating([]));
            dispatch(ratings.actions.setError(data.response));
          });
        }
      });
    event.preventDefault();
  };

  // this deletes a rating  - need to be fixed so we don't need to refresh website to see
  const onDeleteRating = ratingId => {
    const options = {
      method: 'DELETE',
    };

    fetch(`http://localhost:8080/ratings/${ratingId}`, options)
      .then(res => res.json())
      .then(data => {
        const remainingRatings = rating.filter(rate => rate._id !== data._id);

        return remainingRatings;
      });
  };

  // handles  the GETTING of rating to show
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch('http://localhost:8080/ratings', options)
      .then(res => res.json())
      .then(data => {
        // if (data.success) {
        dispatch(ratings.actions.addRating(data.response));
        dispatch(ratings.actions.setError(null));
        //  dispatch(ratings.actions.setRating(data.response));
        setRating(data.response);
        // } else {
        //   dispatch(ratings.actions.addRating([]));
        //   dispatch(ratings.actions.setError(data.response));
        //   //   setValidationError(data.response);   in the console: Can't perform a React state update on an unmounted component.
        // }
        console.log(data.response);
      });
  }, [accessToken, dispatch, rating]);

  const handleLogout = () => {
    dispatch(user.actions.logout());
  };
  console.log(ratingItems);

  return (
    <div>
      <Link to='/user'>To your profile</Link>
      {!canWrite && (
        <button onClick={() => handleWriteRating()}>ADD RATING</button>
      )}
      {canWrite && (
        <form onSubmit={handleFormSubmit}>
          <label htmlFor='ratingText'>Rating text</label>
          <textarea
            rows='4'
            cols='50'
            value={input}
            onChange={event => setInput(event.target.value)}
          ></textarea>
          <button onClick={onRatingPost}>Add rating</button>
        </form>
      )}

      {rating.map(item => (
        <div key={item._id}>
          <p>{item.ratingText}</p>
          <button onClick={() => onDeleteRating(item._id)}>DELETE</button>
        </div>
      ))}

      {/* this handles the error messages */}
      {validationError !== null && <p>{validationError}</p>}

      <h1>Hello world, this is the signed in content</h1>
      <button onClick={handleLogout}>SIGN OUT</button>
    </div>
  );
};
