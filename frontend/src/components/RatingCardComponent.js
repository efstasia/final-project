import React from 'react';
import moment from 'moment';

import { RatingCard, Question, Answer, DateAndUser } from '../styles/Styles';

export const RatingCardComponent = ({ item }) => {
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

  return (
    <RatingCard>
      <div
        style={{
          height: '120px',
          background: 'rgba(249, 105, 14, 0.7)',
          backgroundImage: backgroundImage(item.selectCategory),
        }}
      ></div>

      <div>
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
      </div>
    </RatingCard>
  );
};
