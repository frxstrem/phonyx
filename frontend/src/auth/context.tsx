import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { getApiBaseUrl } from "../api";

type AuthUser = {
  username: string;
  password: string;
};

export type User = {
  username: string;
};

export type Auth = {
  user: User | null;

  authHeaders: { [name: string]: string | undefined };

  logIn(username: string, password: string): Promise<void>;
  logOut(): Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export type AuthProviderProps = {
  children: ReactNode;
};

function basicAuth(username: string, password: string): string {
  return "Basic " + btoa(username + ":" + password);
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [activeUser, setActiveUser] = useState<AuthUser | undefined>();

  const logIn = useCallback(
    async (username, password) => {
      // check against API to see if it is valid
      const res = await fetch(getApiBaseUrl() + "/auth/status", {
        headers: {
          authorization: basicAuth(username, password),
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to log in: ${res.status} ${res.statusText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await res.json();

      setActiveUser({ username, password });
    },
    [setActiveUser]
  );

  const logOut = useCallback(async () => {
    setActiveUser(undefined);
  }, [setActiveUser]);

  const auth: Auth = useMemo(() => {
    const user = activeUser != null ? { username: activeUser.username } : null;

    const authHeaders =
      activeUser != null
        ? {
            authorization: basicAuth(activeUser.username, activeUser.password),
          }
        : {};

    return {
      user,
      authHeaders,
      logIn,
      logOut,
    };
  }, [activeUser, logIn, logOut]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): Auth => {
  const auth = useContext(AuthContext);
  if (auth == null)
    throw new Error("useAuth() must be called inside <AuthProvider>");

  return auth;
};
