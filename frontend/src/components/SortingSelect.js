// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// import { ratings } from '../reducers/ratings';
// import { API_URL } from '../utils/urls';
// import styled from 'styled-components';
// import moment from 'moment';

// import { AddRating } from './AddRating';
// import { SearchBar } from './SearchBar';

// import { RatingCardComponent } from './RatingCardComponent';

// import {
//   Button,
//   SearchAndSortContainer,
//   RatingContainer,
//   RatingCard,
//   RatingText,
//   Question,
//   Answer,
//   DateAndUser,
// } from '../styles/Styles';

// const ProfileImage = styled.div`
//   height: 40px;
//   width: 40px;
//   background: #161616;
//   border-radius: 50%;
// `;

// export const SortingSelect = props => {
//   const [data, setData] = useState([]);
//   const [sortType, setSortType] = useState('ratings');
//   const [ratingInput, setRatingInput] = useState([]);

//   const dispatch = useDispatch();

//   const rating = useSelector(store => store.ratings.items);

//   console.log(rating);

//   useEffect(() => {
//     if (sortType === 'highToLow') {
//       setData([...rating].sort((a, b) => b.selectRating - a.selectRating));
//     } else if (sortType === 'lowToHigh') {
//       setData([...rating].sort((a, b) => a.selectRating - b.selectRating));
//     } else if (sortType === 'all') {
//       setData(rating);
//     }
//   }, [sortType, rating]);

//   return (
//     <div>
//       <div>
//         <select onChange={event => setSortType(event.target.value)}>
//           <option value='all' defaultValue>
//             all
//           </option>
//           <option value='highToLow'>high to low</option>
//           <option value='lowToHigh'>low to high</option>
//           <option></option>
//         </select>
//       </div>
//       {data &&
//         data.map(item => (
//           <div key={item._id}>
//             <RatingCardComponent item={item} />
//           </div>
//         ))}
//     </div>
//   );
// };
