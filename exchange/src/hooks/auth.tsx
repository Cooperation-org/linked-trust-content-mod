// import { createContext, useContext, useState } from 'react';

// interface AuthContextType {
//   token: string | null;
//   setToken: (token: string | null) => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   token: null,
//   setToken: () => {},
// });

// interface AuthProviderProps {
//   children?: React.ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);

//   return (
//     <AuthContext.Provider value={{ token, setToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const { token, setToken } = useContext(AuthContext);

//   return { token, setToken };
// };

import { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

interface AuthContextType {
  id: number | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  id: null,
  role: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [id, setId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('cmtoken');
    if (token) {
      const decodedToken = jwtDecode<{ id: number; role: string }>(token);
      setId(decodedToken.id);
      setRole(decodedToken.role);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('cmtoken', token);
    const decodedToken = jwtDecode<{ id: number; role: string }>(token);
    setId(decodedToken.id);
    setRole(decodedToken.role);
  };

  const logout = () => {
    try {
      localStorage.removeItem('cmtoken');
    } catch (error) {
      console.error('Error removing item from local storage:', error);
    } finally {
      setId(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ id, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
