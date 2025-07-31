import { create } from 'zustand';
import { mockUser } from './data';
import { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// In a real app, we would use a proper authentication system
// This is just a mock implementation for demonstration purposes
export const useAuth = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('user'),
  login: async (email: string, password: string) => {
    // Mock authentication - in a real app, this would make an API call
    if (email && password) {
      // Using mock user for demonstration
      localStorage.setItem('user', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: async (username: string, email: string, password: string) => {
    // Mock registration - in a real app, this would make an API call
    if (username && email && password) {
      const newUser = {
        ...mockUser,
        id: `user-${Date.now()}`,
        username,
        email,
        joinedAt: new Date(),
        solvedProblems: [],
        streak: 0,
        lastActive: new Date()
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  }
}));

// This custom hook will be used to protect routes that require authentication
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, redirectTo]);

  return isAuthenticated;
}

export function getUserDailyPuzzleDay(): number {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const firstLoginDate = user.joinedAt ? new Date(user.joinedAt) : new Date();
  const today = new Date();
  
  // Calculate the difference in days
  const diffTime = Math.abs(today.getTime() - firstLoginDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return day in the range 1-7 (representing a week cycle)
  return ((diffDays - 1) % 7) + 1;
}

// For code editor validation permissions
export function canRunCode(): boolean {
  return useAuth.getState().isAuthenticated;
}

// Import React hooks at the top to avoid errors
import { useEffect } from 'react';