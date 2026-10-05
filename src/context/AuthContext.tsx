'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const API_URL = 'http://localhost:4000/api/v1';

type Profile = {
  id?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  title?: string;
  location?: string;
};

type User = {
  id: string;
  email: string;
  role: string;
  isVerified?: boolean;
  profile?: Profile;
  name?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem(
      'skillbridge_access_token'
    );

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        localStorage.removeItem(
          'skillbridge_access_token'
        );
        localStorage.removeItem(
          'skillbridge_refresh_token'
        );

        setUser(null);
        return;
      }

      const backendUser =
        result.data?.user || result.data;

      setUser(backendUser);
    } catch (error) {
      console.error(
        'Failed to load authenticated user:',
        error
      );

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Login failed'
      );
    }

    const accessToken =
      result.data?.accessToken;

    const refreshToken =
      result.data?.refreshToken;

    if (!accessToken) {
      throw new Error(
        'Login succeeded but no access token was returned'
      );
    }

    localStorage.setItem(
      'skillbridge_access_token',
      accessToken
    );

    if (refreshToken) {
      localStorage.setItem(
        'skillbridge_refresh_token',
        refreshToken
      );
    }

    await loadUser();
  };

  const logout = async () => {
    const refreshToken =
      localStorage.getItem(
        'skillbridge_refresh_token'
      );

    try {
      if (refreshToken) {
        await fetch(
          `${API_URL}/auth/logout`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              refreshToken,
            }),
          }
        );
      }
    } catch (error) {
      console.error(
        'Logout request failed:',
        error
      );
    }

    localStorage.removeItem(
      'skillbridge_access_token'
    );

    localStorage.removeItem(
      'skillbridge_refresh_token'
    );

    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}