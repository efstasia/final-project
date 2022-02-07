import React from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import moment from 'moment';

import { ratings } from '../reducers/ratings';
import {
  Button,
  SearchAndSortContainer,
  RatingContainer,
  RatingCard,
  RatingText,
  Question,
  Answer,
  DateAndUser,
} from '../styles/Styles';

export const RatingCardComponent = ({ item }) => {
  const backgroundColor = selectCategory => {
    if (selectCategory === 'Pizza') {
      return '#1F6F8B';
    }
    if (selectCategory === 'Hamburger') {
      return '#346751';
    }

    if (selectCategory === 'Sushi') {
      return ' #C84B31';
    }
    if (selectCategory === 'Pasta') {
      return '#FFC947';
    }
    if (selectCategory === 'Other') {
      return '#CF455C';
    }
  };

  const backgroundImage = selectCategory => {
    if (selectCategory === 'Pizza') {
      return 'url(https://i.postimg.cc/6qCg1BMm/16399430961571183077-128-1.png)';
    }
    if (selectCategory === 'Hamburger') {
      return 'url(https://i.postimg.cc/DfPfphRG/6190425961595501135-128.png)';
    }
    if (selectCategory === 'Sushi') {
      return 'url(https://i.postimg.cc/jjFyBN9D/8007019041538117462-128.png)';
    }
    if (selectCategory === 'Pasta') {
      return 'url(https://i.postimg.cc/fRknMQyJ/17811043341538117461-128-1.png)';
    }
    if (selectCategory === 'Other') {
      return 'url(https://i.postimg.cc/KjbqYjSr/16538534611595501138-128-1.png)';
    }
  };

  //const username = useSelector(store => store.user.username);

  const dispatch = useDispatch();

  return (
    <RatingCard>
      <div
        style={{
          height: '120px',
          background: backgroundColor(item.selectCategory),
          backgroundImage: backgroundImage(item.selectCategory),
          // filter: 'brightness(0) invert(1);',
        }}
      ></div>

      <RatingText>
        <Question>RESTAURANT NAME</Question>
        <Answer> {item.restaurantName}</Answer>
        <Question>RATING TEXT </Question>
        <Answer>{item.ratingText}</Answer>
        <Question>CATEGORY </Question> <Answer>{item.selectCategory}</Answer>
        <Question>RATING</Question> <Answer> {item.selectRating} </Answer>
        <Question>RECOMMEND? </Question> <Answer> {item.radioInput}</Answer>
        <DateAndUser>
          {moment(item.createdAt).format('ll')}
          {item.user.username ? <span> by {item.user.username}</span> : ''}
        </DateAndUser>
      </RatingText>
    </RatingCard>
  );
};
