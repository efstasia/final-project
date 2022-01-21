// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// //import { ratings } from '../reducers/ratings';

// export const SearchBar = () => {
//   const [restaurantName, setRestaurantName] = useState('');

//   const accessToken = useSelector(store => store.user.accessToken);

//   useEffect(() => {
//     const options = {
//       method: 'GET',
//       headers: {
//         Authorization: accessToken,
//       },
//       body: JSON.stringify({
//         restaurantName,
//       }),
//     };
//     fetch(`http://localhost:8080/ratings?restaurant=${restaurantName}`, options)
//       .then(res => res.json())
//       .then(json => setRestaurantName(json));
//   }, [accessToken, restaurantName]);

//   const handleSearchBar = event => {
//     setRestaurantName(event.target.value);
//   };

//   return (
//     <div>
//       <form onSubmit={event => event.preventDefault()}>
//         <label htmlFor='search-bar'>search</label>
//         <input
//           id='search-bar'
//           value={restaurantName}
//           onChange={handleSearchBar}
//         />
//         <button type='submit'>search</button>
//       </form>
//     </div>
//   );
// };
