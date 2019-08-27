import { useReducer, useRef, useEffect } from 'react';
import axios from 'axios';

function useThunk(reducer, initialState) {
  const mounted = useRef(true);
  useEffect(() => () => (mounted.current = false), []);

  const [state, dispatch] = useReducer(reducer, initialState);
  function mountedDispatch(action) {
    if (mounted.current) {
      dispatch(action);
    }
  }

  function thunk(options, actions, args = {}, callback) {
    mountedDispatch({ type: actions[0], args });
    axios(options)
      .then(res => {
        mountedDispatch({ type: actions[1], res, args });
        if (callback) callback(undefined, res);
      })
      .catch(err => {
        mountedDispatch({ type: actions[2], err, args });
        if (callback) callback(err);
      });
  }

  return [state, thunk, mountedDispatch];
}

export default useThunk;
