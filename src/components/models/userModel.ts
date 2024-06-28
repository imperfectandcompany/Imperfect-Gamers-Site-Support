// src/models/userModel.ts

interface User {
    userId: number; // Unique identifier for the user
    email: string;
    username: string;
    role: "headadmin" | "admin" | "moderator" | "premium" | "player";
    isAuthenticated: boolean;
  }
  
  // Mock user data with userId
  const mockUser: User = {
    userId: 1, // Example user ID
    email: "admin@example.com",
    username: "JohnDoe",
    role: "headadmin",
    isAuthenticated: false,
  };
  
  export interface UserModel {
    login: (email: string, password: string) => boolean;
    isAuthenticated: () => boolean;
    logout: () => void;
    isStaff: () => boolean;
    getUser: () => User; // Method to get user details
  }
  
  export const useMockAuth = (): UserModel => {
    // Function to simulate login
    const login = (email: string, password: string): boolean => {
      if (email === mockUser.email && password === "password") {
        mockUser.isAuthenticated = true;
        return true;
      }
      return false;
    };
  
    // Function to check if the user is authenticated
    const isAuthenticated = () => {
      return mockUser.isAuthenticated;
    };
  
    // Function to check if the user is a staff member
    const isStaff = () => {
      return ["headadmin", "admin", "moderator"].includes(mockUser.role);
    };
  
    // Function to simulate logout
    const logout = () => {
      mockUser.isAuthenticated = false;
    };
  
    // Function to get the current user
    const getUser = () => {
      return mockUser;
    };
  
    return { login, isAuthenticated, logout, isStaff, getUser };
  };
  