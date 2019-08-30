import React, { useState, useReducer, useEffect } from 'react';
import useThunk from '../hooks/useThunk';
import styled from '@emotion/styled';
// Components
import Flex from './Flex';
// State
import { types, reducer, INITIAL_STATE } from '../state/analyzer';
import { stat } from 'fs';

function formatFeature(feature) {
  return (feature * 100).toFixed(1);
}

function rescaleFeature(feature) {
  return ((((feature + 60) * (1 + 2 / 3)) - 65) * (10/3.5)).toFixed(1);
}

function Analyzer({ match, getAuth }) {
  const [state, thunk, dispatch] = useThunk(reducer, INITIAL_STATE);
  const auth = getAuth();
  // Fetch playlist to be analyzed
  useEffect(() => {
    thunk(
      {
        url: `https://api.spotify.com/v1/playlists/${match.params.id}`,
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
      [types.GET_PLAYLIST_REQ, types.GET_PLAYLIST_RES, types.GET_PLAYLIST_ERR]
    );
  }, [match.params.id, auth]);
  // Fetch audio features of all playlist tracks
  useEffect(() => {
    if (state.playlist && state.playlist.length > 0) {
      thunk(
        {
          url: `https://api.spotify.com/v1/audio-features`,
          params: {
            ids: state.playlist.join(','),
          },
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
        [types.GET_FEATURES_REQ, types.GET_FEATURES_RES, types.GET_FEATURES_ERR]
      );
    }
  }, [state.playlist, auth]);
  // Generate playlist averages
  useEffect(() => {
    if (Object.keys(state.songs).length) {
      const map = {
        energy: 0,
        danceability: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        speechiness: 0,
        loudness: 0,
      };
      state.playlist.forEach(id => {
        const song = state.songs[id];
        map.energy = formatFeature(song.energy);
        map.danceability = formatFeature(song.danceability);
        map.acousticness = formatFeature(song.acousticness);
        map.instrumentalness = formatFeature(song.instrumentalness);
        map.liveness = formatFeature(song.liveness);
        map.speechiness = formatFeature(song.speechiness);
        map.loudness = rescaleFeature(song.loudness);
      });
      Object.entries(map).forEach(([average, value]) => {
        dispatch({ type: types.UPDATE_AVERAGE, average, value });
      });
    }
  }, [state.playlist, state.songs]);

  console.log(state);

  return (
    <div>
      {state.playlist && state.playlist.length ? (
        <>
          <Flex>
            <AlbumArt src={state.playlistDetails.images[0].url} />
            <Flex direction="column" justify="flex-end" h="150px">
              <DetailText>PLAYLIST</DetailText>
              <PlaylistTitle>{state.playlistDetails.name}</PlaylistTitle>
              <DetailText>{`${state.playlist.length} songs`}</DetailText>
            </Flex>
          </Flex>
          <div>
            <Flex
              align="flex-end"
              style={{
                position: 'sticky',
                top: '0',
                height: '120px',
                backgroundColor: '#000',
                paddingBottom: '.25em',
              }}
            >
              <Flex style={{ width: '60%', height: 'auto' }}>
                <ListHeading w="50%">TITLE</ListHeading>
                <ListHeading w="50%">ARTIST</ListHeading>
              </Flex>
              <ListHeading tilt w="60px">
                ENERGY
              </ListHeading>
              <ListHeading tilt w="60px">
                DANCEABILITY
              </ListHeading>
              <ListHeading tilt w="60px">
                ACOUSTICNESS
              </ListHeading>
              <ListHeading tilt w="60px">
                INSTRUMENTALNESS
              </ListHeading>
              <ListHeading tilt w="60px">
                LIVENESS
              </ListHeading>
              <ListHeading tilt w="60px">
                SPEECHINESS
              </ListHeading>
              <ListHeading tilt w="60px">
                LOUDNESS
              </ListHeading>
            </Flex>
            {state.playlist.map(t => {
              const song = state.songs[t];
              const energy = formatFeature(song.energy);
              const dance = formatFeature(song.danceability);
              const acoustic = formatFeature(song.acousticness);
              const instrumental = formatFeature(song.instrumentalness);
              const live = formatFeature(song.liveness);
              const speech = formatFeature(song.speechiness);
              const loud = rescaleFeature(song.loudness);
              return (
                <Flex>
                  <Flex w="60%" style={{ borderBottom: '1px solid #666' }}>
                    <SongName>{song.name}</SongName>
                    <SongName>{song.artists[0].name}</SongName>
                  </Flex>
                  <Feature value={energy}>{energy}</Feature>
                  <Feature value={dance}>{dance}</Feature>
                  <Feature value={acoustic}>{acoustic}</Feature>
                  <Feature value={instrumental}>{instrumental}</Feature>
                  <Feature value={live}>{live}</Feature>
                  <Feature value={speech}>{speech}</Feature>
                  <Feature value={loud}>{loud}</Feature>
                </Flex>
              );
            })}
            <br />
            <Flex>
              <Flex w="60%">
                <SongName>Playlist Averages</SongName>
              </Flex>
              {state.averages &&
                Object.values(state.averages).map(avg => (
                  <Feature value={avg}>{avg}</Feature>
                ))}
            </Flex>
          </div>
        </>
      ) : null}
    </div>
  );
}

const Layout = styled('div')`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

const AlbumArt = styled('img')`
  height: 150px;
  width: 150px;
  object-fit: cover;
  margin-right: 1em;
`;

const PlaylistTitle = styled('h1')`
  margin: 0em 0em 0.25em;
`;

const DetailText = styled('p')`
  color: #ddd;
  font-size: 0.9rem;
  margin: 0;
`;

const SongName = styled('div')`
  width: 50%;
  max-width: 50%;
  height: 40px;
  max-height: 40px;

  padding-right: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Feature = styled('div')`
  width: 60px;
  max-width: 60px;
  height: 40px;
  max-height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ color = [30, 215, 96], value = 0 }) => {
    const [red, green, blue] = color;
    return `rgba(${red}, ${green}, ${blue}, ${value / 100})`;
  }};
`;

const ListHeading = styled('p')`
  font-size: 0.8rem;
  color: #ddd;
  width: ${p => p.w || '100%'};
  margin: 0;

  ${p => {
    if (p.tilt) {
      return `
        transform:  translateX(20px) translateY(-30px) rotate(-45deg);
      `;
    }
  }}
`;

export default Analyzer;
