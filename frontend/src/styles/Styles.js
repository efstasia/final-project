import styled from 'styled-components';
import darkpaint from '../images/darkpaint.jpg';
import darkfeed from '../images/darkfeed.jpg';
import backgroundsignup from '../images/backgroundsignup.jpg';

/* -------------HEADER--------------- */
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
    height: 70px;
    width: auto;
  }

  div {
    display: flex;
  }

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    height: 160px;
    margin-bottom: 10px;
    width: 100vw;

    div {
      display: flex;
      margin-top: auto;
    }

    h1 {
      font-size: 28px;
    }
    img {
      height: 30%;
    }
  }
`;

/* -------------START PAGE--------------- */
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

  .signup-link {
    text-decoration: none;
    color: #fafafa;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
  }
`;

/* -------------SEARCH AND SORT CONTAINER--------------- */
export const SearchAndSortContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 20%;
  margin: 20px auto;

  input,
  select {
    margin: 0 5px;
    border-radius: 10px 0;
    padding: 8px;
    font-family: 'Poppins', sans-serif;
  }
`;

/* -------------FEED--------------- */
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

  .add-button {
   border-radius: 50%;
   width: 60px;
   height: 60px;
   position: relative;
   left: 94%;
   top: 10px:
   margin: 5px;
   border: 1px solid #e8993a;
  }

  .toggle-button {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    position: absolute;
    left: 90%;  
    width: 60px;
    height: 60px;
    position: absolute;
    left: 90%;
  }

  @media (max-width:768px) {
    .add-button {
      left: 0;
      margin-bottom: 24px;
      width: 70px;
      height: 70px;
    }
  }

  @media (max-width:481px) {
    .add-button {
      left: 10%
    }
  }
`;

/* -------------RATING INPUT FORM--------------- */
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

/* -------------RATING FEED CONTAINER--------------- */
export const RatingContainer = styled.div`
  width: 100%;
  background-image: url(${darkfeed});
  background-size: cover;
  padding-top: 50px;

  .inner-div-feed {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 80%;
    margin: auto;
    padding-top: 40px;
    background: rgba(255, 255, 255, 0.6);
    margin-bottom: 20px;
    border: 2px solid #e8993a;
  }

  .inner-card-feed {
    margin: auto;
    padding: 10px;
    border: 2px solid black;
    margin-bottom: 10px;
  }
  .no-ratings {
    display: hidden;
  }

  @media (max-width: 768px) {
    width: 100vw;
    .inner-div-feed {
      grid-template-columns: 1fr;
      width: 80%;
    }
    .inner-card-feed {
      width: 80%;
    }
  }
`;

export const NoRatingDiv = styled.div`
  display: flex;
  img {
    margin: auto;
  }
`;

export const LoadMoreContainer = styled.div`
  @media (max-width: 768px) {
    width: 50%;
    margin: 10px auto;
  }
`;

/* -------------------USERPAGE-------------------------- */
export const ProfileContainer = styled.div`
  height: 500px;
  padding-top: 40px;
  border-radius: 4px;
  position: relative;
  margin: 10px auto;
  font-family: 'Poppins', sans-serif;
  border: 1px solid black;
  background-image: url(${darkpaint});
  background-size: cover;

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
    z-index: 1;
  }
  @media (max-width: 768px) {
    width: 100vw;
    .grid-wrapper {
      display: flex;
      flex-direction: column;
    }
  }

  .image-grid {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.15);
    border: 2px solid darkorange;
  }

  .info-grid {
    width: 100%;
    border: 2px solid darkorange;
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

export const UserpageTitle = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
`;

export const RatingHeaderText = styled.h3`
  text-align: center;
  font-family: 'Poppins', sans-serif;
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
    z-index: 10;
  }

  .closeImageUpload {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    position: absolute;
    left: 82%;
    bottom: 75%;
  }
`;

/* -------------USERPAGE RATING CONTAINER--------------- */
export const UserpageContainer = styled.div`
  display: grid;
  width: 100%;
  background-image: url(${darkpaint});
  background-size: cover;

  .inner-div {
    display: grid;
    width: 80%;
    margin: auto;
    padding-top: 40px;
    background: rgba(255, 255, 255, 0.6);
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 20px;
  }

  .inner-card {
    margin: auto;
    padding: 10px;
    border: 2px solid black;
    margin-bottom: 10px;
    z-index: 10;
  }

  .delete-userpage-button {
    border-radius: none;
  }

  @media (max-width: 768px) {
    width: 100vw;
    .inner-div {
      grid-template-columns: repeat(1, 1fr);
    }
    .inner-card {
      width: 80%;
      padding: 0;
    }
  }
`;

export const Question = styled.p`
  font-weight: bold;
  text-align: center;
  padding: 2px 0;
  margin-bottom: 3px;
  color: #161616;
  text-decoration: underline;
`;

export const Answer = styled.p`
  margin-top: 3px;
  text-align: center;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  width: 80%;
  margin: auto;
  color: #161616;
`;

export const DateAndUser = styled.p`
  font-style: italic;
  font-size: 12px;
  color: #fafafa;
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
  background-image: url(${backgroundsignup});
  height: 100vh;

  .signin-button {
    width: 20%;
    margin: 20px auto;
  }

  @media (max-width: 768px) {
    width: 100vw;
  }
`;

/* -------------SIGNUP/LOGIN PAGE--------------- */
export const SignupContainer = styled.div`
  margin: auto;
  padding-top: 50px;
  grid-template-columns: 1fr;
  display: grid;

  fieldset {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 30%;
    border: 2px solid;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.7);
  }

  legend {
    font-family: 'Yellowtail', cursive;
    font-size: 32px;
  }

  form {
    font-family: 'Poppins', sans-serif;
  }

  label,
  input {
    width: 70%;
    margin: auto;
  }

  .submit-user-button {
    width: 50%;
    margin: 10px auto;
  }
  @media (max-width: 768px) {
    fieldset {
      width: 80%;
    }
    input {
      padding: 10px;
    }
  }
`;

/* -------------GLOBAL RATING CARDS--------------- */
export const RatingCard = styled.div`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: 'Poppins', sans-serif;
  width: 400px;
  height: 100%;

  @media (max-width: 768px) {
    width: 90%;
    margin: auto;
  }
`;

/* -------------FOOTER--------------- */
export const FooterContainer = styled.footer`
  height: 5%;
  width: 100%;
  background-color: #161616;
  position: relative;
  bottom: 0;
  left: 0;
  color: white;
  text-align: center;
  padding: 15px 0;
  font-family: 'Poppins', sans-serif;
`;

/* -------------GLOBAL BUTTON/BUTTONS--------------- */
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

export const AddButtonContainer = styled.div`
  display: grid;
  width: 40%;
  align-items: center;
  margin: 0px auto;
`;
