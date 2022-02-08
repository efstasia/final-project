import styled, { keyframes } from 'styled-components';
import darkbackground from '../images/darkbackground.jpg';
import darkpaint from '../images/darkpaint.jpg';

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

export const Title = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
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

export const UserpageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 70%;
  margin: auto;
  gap: 15px;
  border: 2px solid red;
  margin-top: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const RatingCard = styled.div`
  border: 2px solid black;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: 'Poppins', sans-serif;
  width: 400px;
  height: 100%;
`;

export const RatingText = styled.div``;

export const Question = styled.p`
  font-weight: bold;
  background: #242424;
  text-align: center;
  padding: 2px 0;
  margin-bottom: 3px;
  color: #fafafa;
`;

export const Answer = styled.p`
  margin-top: 3px;
  text-align: center;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  width: 80%;
  margin: auto;
`;

export const DateAndUser = styled.p`
  font-style: italic;
  font-size: 12px;

  padding-right: 10px;
  background: #242424;
  display: flex;
  justify-content: flex-end;
`;

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100vh;

  video {
    width: auto;
    height: 20%;
  }
`;

export const SignupContainer = styled.div`
  width: 40%;
  /* margin: auto; */

  fieldset {
    display: flex;
    flex-direction: column;

    border: 2px solid;
    border-radius: 2px;
  }

  legend {
    font-family: 'Yellowtail', cursive;
    font-size: 32px;
  }

  form {
    font-family: 'Poppins', sans-serif;
  }
`;

export const StartPageContainer = styled.div`
  .parent {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    grid-column-gap: 15px;
    grid-row-gap: 30px;
    width: 80%;
    margin: 50px auto;
    @media (max-width: 767px) {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;

      .div1 {
        order: 2;
        width: 80%;
        margin: auto;
      }
      .div1 img {
        /* align-content: center; */
        margin: auto;
      }
      .div2 {
        order: 1;
        margin-bottom: 30px;
      }
      .div3 {
        order: 3;
        margin-bottom: 30px;
        width: 75%;
      }
      .div4 {
        order: 4;
      }
      .div4 img {
        width: 64%;
      }
    }
  }

  .div1 {
    grid-area: 1 / 1 / 2 / 2;
  }
  .div2 {
    grid-area: 1 / 2 / 2 / 3;
    transform: translateY(25%);
    width: 70%;
  }
  .div3 {
    grid-area: 2 / 1 / 3 / 2;
    transform: translateY(25%);
  }
  .div4 {
    grid-area: 2 / 2 / 3 / 3;
  }

  .div4 > img {
    height: 80%;
  }

  img {
    /* height: 70%;
    width: auto; */
  }

  .signup-link {
    text-decoration: none;
    color: #fafafa;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
  }
`;

export const ProfileContainer = styled.div`
  height: 500px;

  border-radius: 4px;
  position: relative;
  margin: 10px auto;
  font-family: 'Poppins', sans-serif;
  border: 1px solid black;
  /* background: #44a08d;
  background: -webkit-linear-gradient(to left, #093637, #44a08d);
  background: linear-gradient(to left, #093637, #44a08d); */
  background-image: url(${darkpaint});

  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    width: 70%;
    gap: 10px;
    justify-items: center;
    margin: 20px auto;
    align-content: center;

    backdrop-filter: blur(5px);
  }

  .image-grid {
    width: 100%;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.15);
  }

  .info-grid {
    width: 100%;
    border: 2px solid black;
    text-align: center;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.15);
    color: #fafafa;
  }

  img {
    margin: auto;
    width: 30%;
    display: block;
  }
`;

export const EditImageDiv = styled.div`
  position: absolute;
  background: lightsteelblue;
  height: 250px;
  width: 350px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  img,
  input {
    margin: auto;
    display: block;
    top: 30px;
    position: relative;
  }
`;
