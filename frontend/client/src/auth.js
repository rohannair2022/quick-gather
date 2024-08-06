// https://github.com/obabichev/react-token-auth
// Helps manage the login-auth process by managing the tokens (refresh / access)
import { createAuthProvider } from "react-token-auth";

// Login: Helps with creating tokens by accessing the flask api created in auth.py
// Logout: Used to remove the token from the local storage.
// useAuth: A function that returns true iff there is a valid access token in the local storage.
//         This allows react to re-render the components according to the state.
// authFetch: A wrapper class for fetch
export const { useAuth, authFetch, login, logout } = createAuthProvider({
  // Set the access token recieved from the API.
  getAccessToken: (session) => session.access_token,
  // Tokens are stored in the local storage of the browser.
  storage: localStorage,
  // Fetch the token
  onUpdateToken: (token) =>
    fetch("/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.refresh_token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => ({
        access_token: data.accessToken,
        refresh_token: token.refresh_token, // Keep the existing refresh token
      })),
});

export function setupTokenRefresh(expiresIn) {
  const refreshTime = (expiresIn - 300) * 1000;
  const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
  setTimeout(async () => {
    try {
      const result = await authFetch("/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.refresh_token}`,
        },
      });
      if (result.ok) {
        const data = await result.json();
        token.access_token = data.accessToken;
        setupTokenRefresh(3600);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  }, refreshTime);
}
