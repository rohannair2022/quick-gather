import { createAuthProvider } from "react-token-auth";

export interface Session {
  access_token: string;
  refresh_token: string;
}

export const { useAuth, authFetch, login, logout } =
  createAuthProvider<Session>({
    getAccessToken: (session: Session) => session.access_token,

    storage: localStorage,

    onUpdateToken: (session: Session) =>
      fetch("/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.refresh_token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Assuming the response contains only the new access token
          const updatedSession = { ...session, access_token: data.accessToken };
          localStorage.setItem(
            "REACT_TOKEN_AUTH_KEY",
            JSON.stringify(updatedSession)
          );
          return updatedSession;
        }),
  });
