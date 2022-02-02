import styled from 'styled-components';

// HEADER //
export const HeaderContainer = styled.div`
  height: 150px;
  color: white;
  background: #161616;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  padding: 10px;
  font-family: 'Fredoka One', cursive;

  img {
    filter: brightness(0) invert(1);
    height: 40px;
    width: auto;
  }
`;

export const InputWrapper = styled.div`
  
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    width: 50%;
    margin: auto;
    transition: transform 0.3s ease-in-out;

    textarea {
      resize: none;
    }
    /* .toggle-button {
      transition: all 0.5s ease-in-out;
    } */
  }
`;

// RATING FORM //
export const Form = styled.form`
  position: absolute;
  width: 50%;
  display: flex;
  flex-direction: column;
  background: pink;
  border: 2px solid black;
  box-shadow: 4px 5px 2px black;
  z-index: 1;
  background: lightsteelblue;
  color: #161616;
  font-family: 'Poppins', sans-serif;
  padding: 5px;
  border-radius: 2px;

  label,
  select,
  textarea,
  input {
    width: 50%;
    text-align: center;
    margin: 3px auto;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
  }

  button {
    margin: 5px auto;
  }
`;

export const AddButtonContainer = styled.div`
  display: grid;
  width: 40%;
  align-items: center;
  margin: 0px auto;
`;

// LOG OUT BUTTON //
export const Button = styled.button`
    background-color: #222;
    border-radius: 4px;
    border-style: none;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: 'Fredoka One', cursive;
    font-size: 16px;
    font-weight: 200;
    line-height: 1.5;
    margin: 0;
    max-width: none;
    min-height: 44px;
    min-width: 10px;
    outline: none;
    overflow: hidden;
    padding: 9px 20px 8px;
    position: relative;
    text-align: center;
    text-transform: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: 100%;
  }

  &:hover,
  &:focus {
    opacity: 0.75;
  }


`;

export const LogOutButtonContainer = styled.div`
  position: relative;
  top: 300px;
`;

export const SearchAndSortContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 20%;
  margin: 5px auto;

  input {
    margin: 0 5px;
  }
`;

export const RatingContainer = styled.div`
  width: 70%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

export const RatingCard = styled.div`
  border: 2px solid black;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

export const RatingText = styled.div``;

export const Question = styled.p`
  margin-bottom: 3px;
`;

export const Answer = styled.p`
  margin-top: 3px;
`;

export const DateAndUser = styled.p`
  font-style: italic;
  font-size: 12px;
  align-self: flex-end;
`;
