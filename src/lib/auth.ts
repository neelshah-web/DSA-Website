import { create } from 'zustand';
import { mockUser } from './data';
import { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, fullName: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
}

// Function to generate profile picture from initials
const generateProfilePicture = (firstName: string, lastName: string): string => {
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  
  // Create a simple SVG avatar with initials
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  // Use a simple hash of the name to pick a consistent color
  const nameHash = (firstName + lastName).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const color = colors[Math.abs(nameHash) % colors.length];
  
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}"/>
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            text-anchor="middle" dominant-baseline="central" fill="white">
        ${initials}
      </text>
    </svg>
  `;
  
  // Convert SVG to data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

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
  register: async (username: string, email: string, password: string, fullName: string, firstName: string, lastName: string) => {
    // Mock registration - in a real app, this would make an API call
    if (username && email && password && fullName && firstName && lastName) {
      const profilePicture = generateProfilePicture(firstName, lastName);
      
      const newUser = {
        ...mockUser,
        id: `user-${Date.now()}`,
        username,
        email,
        name: fullName,
        avatar: profilePicture,
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