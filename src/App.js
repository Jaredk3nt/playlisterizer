import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import styled from '@emotion/styled';
// Components

import PlaylistList from './components/PlaylistList';
import Analyzer from './components/Analyzer';
import Flex from './components/Flex';
import Header from './components/Header';
// Hooks
import useAuth from './hooks/useAuth';
// Variables
const LIMIT = 25;

function App({ history }) {
  const [user, setUser] = useState();
  const [offset, setOffset] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [getAuth, clearAuth] = useAuth(() => {
    history.push('/');
    setPlaylists([]);
  });
  // Fetch current auth token for requests
  const auth = getAuth();
  // Fetch list of playlists (also used for paging)
  useEffect(() => {
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
  // Fetch user information
  useEffect(() => {
    if (auth && !user) {
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${auth}` },
        })
        .then(res => {
          console.log(res.data);
          setUser(res.data);
        });
    }
  });
  // Helper function to up the page size to fetch new playlists
  function getNextPage() {
    setOffset(prev => {
      return prev + LIMIT;
    });
  }

  return (
    <>
      <Header user={user} />
      <Content>
        <Route
          path="/"
          exact
          render={() => (
            <>
              {!auth && <h1>Sign in to start analyzing playlists!</h1>}
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
