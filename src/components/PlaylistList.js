import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

function PlaylistList({ playlists }) {
  console.log(playlists);
  return (
    <List>
      {playlists.map(pl => {
        const ii = pl.images.length > 1 ? 1 : 0;
        return (
          <ListItem key={pl.id}>
            <ListLink to={`analyzer/${pl.id}`}>
              <AlbumArt src={pl.images[ii].url} />
              <PlaylistDetails>
                <h2>{pl.name}</h2>
                <p>{pl.tracks.total} songs</p>
              </PlaylistDetails>
            </ListLink>
          </ListItem>
        );
      })}
    </List>
  );
}

const List = styled('ul')`
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled('li')`
  width: calc(33% - .5em);
  height: calc(100px + 2em);
  margin: .25em;
  padding: 1em;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ListLink = styled(Link)`
  display: flex;
  width: 100%;
  height: 100%;
  text-decoration: none;
  align-items: center;
`;

const AlbumArt = styled('img')`
  width: 100px;
  height: 100px;
  margin-right: 1em;
`;

const PlaylistDetails = styled('div')`
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0;
    font-size: 1rem;
  }

  p {
    margin: .2em 0em;
    font-size: .8rem;
    color: #ddd;
  }
`;

export default PlaylistList;
