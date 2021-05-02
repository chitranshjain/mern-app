import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((userId, token, expirationDate) => {
    setUserId(userId);
    setToken(token);
    setIsLoggedIn(true);
    const tokenExpirationDate =
      expirationDate ||
      new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: tokenExpirationDate,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setIsLoggedIn(false);
    setTokenExpirationDate();
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate) - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user && user.token && new Date(user.expiration) > new Date()) {
      login(user.userId, user.token, user.expiration);
    } else {
      console.log("User logged out");
    }
  }, [login]);

  return { token, isLoggedIn, userId, login, logout };
};
