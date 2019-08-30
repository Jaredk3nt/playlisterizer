import React from 'react';
import logo from '../assets/text-logo.png';
import styled from '@emotion/styled';
import Authorize from './Authorize';
import { Link } from 'react-router-dom';
// Components
import Flex from './Flex';

function Header({ user }) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Link to="/">
          <HeaderImg src={logo} alt="playlisterizer" />
        </Link>
        {user ? <UserHeader user={user} /> : <Authorize auth={user} />}
      </HeaderContent>
    </HeaderContainer>
  );
}

function UserHeader({ user }) {
  return (
    <span>
      <Flex align="center">
        <UserImg src={user.images[0].url || ''} alt={user.display_name} />
      </Flex>
    </span>
  );
}

const UserImg = styled('img')`
  border-radius: 50%;
  height: 35px;
  width: 35px;
  border: 1px solid black;
`;

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
