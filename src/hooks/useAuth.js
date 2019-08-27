import { useState, useEffect, useCallback } from 'react';
// Variables
const AUTH_KEY = 'spotify-auth-token';
const AUTH_TIMEOUT_KEY = 'spotify-auth-token-timeout';

function useAuth(onClear) {
  const [auth, setAuth] = useState();
  const [timeout, setTimeout] = useState();

  useEffect(() => {
    if (!auth) {
      // Check if a localstorage value is stored
      const localStorageAuth = window.localStorage.getItem(AUTH_KEY);
      const localStorageTimeout = parseInt(
        window.localStorage.getItem(AUTH_TIMEOUT_KEY)
      );
      const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));
      const lsValid = localStorageAuth && localStorageTimeout > currentTime;
      // If the localstorage is valid setValue
      if (lsValid) {
        setAuth(localStorageAuth);
        setTimeout(localStorageTimeout);
      }
      if (localStorageTimeout < currentTime) {
        clearAuth();
      }
      // If the local storage is bad attempt to read from hash (should remount component and rerun this effect)
      if (!lsValid && window.location.hash) {
        const re = /([^&;=]+)=?([^&;]*)/g;
        const query = window.location.hash.substring(1);
        const authObj = {};
        let q;
        while ((q = re.exec(query))) {
          const key = q[1];
          const value = q[2];
          authObj[key] = value;
        }
        setAuth(authObj.access_token);
        setTimeout(currentTime + authObj.expires_in);
        window.localStorage.setItem(AUTH_KEY, authObj.access_token);
        window.localStorage.setItem(
          AUTH_TIMEOUT_KEY,
          currentTime + authObj.expires_in
        );
      }
    }
  }, [auth]);

  const clearAuth = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(AUTH_TIMEOUT_KEY);
    setAuth(undefined);
    setTimeout(undefined);
    if (onClear) {
      onClear();
    }
  }, []);

  const getAuth = useCallback(() => {
    if (auth) {
      const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));
      if (currentTime < timeout) {
        return auth;
      }
      // If auth is bad purge and force an update
      clearAuth();
    }
  }, [auth, timeout]);

  return [getAuth, clearAuth];
}

export default useAuth;
