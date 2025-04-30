import { createContext } from 'react';

// Erstellen des Auth-Kontexts mit Standardwerten
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  register: () => {},
});