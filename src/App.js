import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import styled from '@emotion/styled';
// Components
import Authorize from './components/Authorize';
import PlaylistList from './components/PlaylistList';
import Analyzer from './components/Analyzer';
import Flex from './components/Flex';
// Hooks
import useAuth from './hooks/useAuth';
// Variables
const LIMIT = 25;

function App({ history }) {
  const [offset, setOffset] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [getAuth, clearAuth] = useAuth(() => {
    history.push('/');
    setPlaylists([]);
  });

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      axios
        .get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
          params: {
            offset,
            limit: LIMIT,
          },
        })
        .then(res => {
          setPlaylists(prev => [...prev, ...res.data.items]);
        });
    }
  }, [getAuth, offset]);

  function getNextPage() {
    setOffset(prev => {
      return prev + LIMIT;
    });
  }

  const currentAuth = getAuth();

  return (
    <>
      <Header>
        <HeaderContent>
          <h1>Playlisterizer</h1>
          <Authorize auth={currentAuth} />
        </HeaderContent>
      </Header>
      <Content>
        <Route
          path="/"
          exact
          render={() => (
            <>
              {!currentAuth && <h1>Sign in to start analyzing playlists!</h1>}
              {playlists && <PlaylistList playlists={playlists} />}
              <Flex justify="center">
                {playlists &&
                playlists.length > 0 &&
                playlists.length % LIMIT === 0 ? (
                  <PageButton onClick={getNextPage}>
                    Load More Playlists
                  </PageButton>
                ) : null}
              </Flex>
            </>
          )}
        />
        <Route
          path="/analyzer/:id"
          render={routeProps => <Analyzer getAuth={getAuth} {...routeProps} />}
        />
      </Content>
    </>
  );
}

const Header = styled('header')`
  background-color: #fff;
  width: 100%;
  height: 50px;
`;
const HeaderContent = styled('div')`
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    color: black;
    font-size: 1.25rem;
    margin: 0;
  }

  a {
    text-decoration: none;
    background-color: #1db954;
    border-radius: 12px;
    padding: 4px 8px;
  }

  p {
    color: black;
  }
`;
const Content = styled('main')`
  width: 1000px;
  margin: 0 auto;
  padding: 1em 0em 3em 0em;
`;
const PageButton = styled('button')`
  font-size: 1rem;
  background-color: #1db954;
  padding: 8px;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

export default withRouter(App);
