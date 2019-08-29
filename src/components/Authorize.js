import React from 'react';
import styled from '@emotion/styled';

const scopes = encodeURIComponent('user-read-private user-read-email');
const clientId = encodeURIComponent('89117e931d6a40c59b08867327957a4e');
const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
// Merge to a single auth URL
const authUrl = `http://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

function Authorize({ auth }) {
  return !auth ? <AuthLink href={authUrl}>Sign In with Spotify</AuthLink> : <p>Signed In</p>;
}

const AuthLink = styled('a')`
  text-decoration: none;
  background-color: #1db954;
  padding: .5em 1em;
  border-radius: 8px;
`;

export default Authorize;
