import React from 'react';
import logo from '../assets/text-logo.png';
import styled from '@emotion/styled';
import Authorize from './Authorize';

function Header({ auth }) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderImg src={logo} alt='playlisterizer' />
        <Authorize auth={auth} />
      </HeaderContent>
    </HeaderContainer>
  )
}

const HeaderContainer = styled('header')`
  background-color: #fff;
  width: 100%;
  height: 50px;
`;

const HeaderContent = styled('nav')`
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderImg = styled('img')`
  height: 42px;
`;

export default Header;