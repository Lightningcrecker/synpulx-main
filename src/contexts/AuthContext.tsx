import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SecureStorage } from '../services/encryption/SecureStorage';

interface User {
  id: string;
  email: string;
  name?: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const secureStorage = SecureStorage.getInstance();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = secureStorage.getItem<User>('user');
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // In a real app, validate with backend
      const storedHash = secureStorage.getItem<string>(`password_${email}`);
      if (!storedHash) throw new Error('Invalid credentials');

      const isValid = await secureStorage.verifyPassword(password, storedHash);
      if (!isValid) throw new Error('Invalid credentials');

      const storedUser = secureStorage.getItem<User>(`userData_${email}`);
      if (!storedUser) throw new Error('User data not found');

      setUser(storedUser);
      setIsAuthenticated(true);
      secureStorage.setItem('user', storedUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
    secureStorage.removeItem('user');
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const hashedPassword = await secureStorage.hashPassword(password);
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        isPremium: false,
      };

      // Store user data securely
      secureStorage.setItem(`password_${email}`, hashedPassword);
      secureStorage.setItem(`userData_${email}`, newUser);
      secureStorage.setItem('user', newUser);

      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};