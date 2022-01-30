import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ratings } from '../reducers/ratings';
import { API_URL } from '../utils/urls';

export const SortingSelect = () => {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState('ratings');

  const dispatch = useDispatch();

  const accessToken = useSelector(store => store.user.accessToken);
  const rating = useSelector(store => store.ratings.items);
  console.log(rating);

  // handles  the GETTING of rating to show
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken,
      },
    };

    fetch(API_URL('feed'), options)
      .then(res => res.json())
      .then(data => {
        dispatch(ratings.actions.setRating(data.response));
        dispatch(ratings.actions.setError(null));
        //  dispatch(user.actions.setUsername(data.response.username));
        console.log(data.response);
      });
  }, [dispatch, accessToken]);

  useEffect(() => {
    const sortArray = type => {
      const types = {
        highToLow: 'highToLow',
        lowToHigh: 'lowToHigh',
      };
      const sortProperty = types[type];
      const sorted = [...rating].sort(
        (a, b) => b[sortProperty] - a[sortProperty]
      );
      setData(sorted);
      console.log(rating);
    };
    sortArray(sortType);
  }, [sortType, rating]);

  return (
    <div>
      <select onChange={e => setSortType(e.target.value)}>
        <option value='highToLow'>highest to lowest</option>
        <option value='lowToHigh'>lowest to highest</option>
      </select>
    </div>
  );
};
