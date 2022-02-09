import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  height: 100%;
  text-align: left;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  font-family: 'Fredoka One', cursive;
  z-index: 1;

  a {
 
    text-decoration: none;
    text-transform: uppercase;
    color: #161616;
    margin: 10px 0;
    font-size: 22px;
  }

    a:active {
      color: #161616;
    }

    a:hover {
     transform: scale(1.1);
   
  }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  } */
`;
