import { useState, useEffect } from 'react';
import { AuthState } from '../types';

const CORRECT_PASSWORD_HASH = '1feb5334d184e393d997e5cd92951f013b1d8ceffce37e329419586b86fe400d'; // SHA-256 of "jobshapedobject"
const AUTH_STORAGE_KEY = 'sebmcAuth';

// Hash password using SHA-256
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    mode: 'view'
  });

  // Check authentication on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth === 'true') {
      setAuthState({
        isAuthenticated: true,
        mode: 'edit'
      });
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    const inputHash = await hashPassword(password);
    if (inputHash === CORRECT_PASSWORD_HASH) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthState({
        isAuthenticated: true,
        mode: 'edit'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      mode: 'view'
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}
