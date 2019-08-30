import { enums, string } from 'fun-enums';

const INITIAL_STATE = {
  playlistDetails: {},
  playlist: [],
  songs: {},
  loadingPlaylist: false,
  loadingFeatures: false,
  averages: {}
};

const types = enums(string)(
  'GET_PLAYLIST_REQ',
  'GET_PLAYLIST_RES',
  'GET_PLAYLIST_ERR',
  'GET_FEATURES_REQ',
  'GET_FEATURES_RES',
  'GET_FEATURES_ERR',
  'UPDATE_AVERAGE'
);

function mapFeaturesToSongs(songs, features) {
  const newSongs = {};
  features.forEach(f => {
    newSongs[f.id] = {
      ...songs[f.id],
      ...f,
    };
  });
  return newSongs;
}

function reducer(state, action) {
  switch (action.type) {
    case types.UPDATE_AVERAGE:
      return {
        ...state,
        averages: {
          ...state.averages,
          [action.average]: action.value
        }
      }
    case types.GET_PLAYLIST_REQ:
      return {
        ...state,
        loadingPlaylist: true,
      };
    case types.GET_PLAYLIST_RES:
      const p = action.res.data;
      const playlist = p.tracks.items.map(t => t.track.id);
      // TODO: change this from reduce to improve speed on longer playlists (may not be a big deal)
      const songs = p.tracks.items.reduce((acc, s) => {
        return { ...acc, [s.track.id]: s.track };
      }, {});

      return {
        ...state,
        loadingPlaylist: false,
        playlistDetails: {
          id: p.id,
          name: p.name,
          url: p.external_urls.spotify,
          images: p.images,
        },
        playlist,
        songs,
      };
    case types.GET_PLAYLIST_ERR:
      return {
        ...state,
        loadingPlaylist: false,
      };
    case types.GET_FEATURES_REQ:
      return {
        ...state,
        loadingFeatures: true,
      };
    case types.GET_FEATURES_RES:
      const f = action.res.data.audio_features;
      return {
        ...state,
        loadingFeatures: false,
        songs: mapFeaturesToSongs(state.songs, f),
      };
    case types.GET_FEATURES_ERR:
      return {
        ...state,
        loadingFeatures: false,
      };
    default:
      return state;
  }
}

export { types, reducer, INITIAL_STATE };
