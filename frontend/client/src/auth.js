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
      body: token.refresh_token,
    }).then((r) => r.json()),
});
