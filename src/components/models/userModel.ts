// src/models/userModel.ts

interface User {
    userId: number; // Unique identifier for the user
    email: string;
    username: string;
    role: "headadmin" | "admin" | "moderator" | "premium" | "player";
    isAuthenticated: boolean;
  }
  
  // Mock user data with userId
  const mockUsers: User[] = [
    {
      userId: 1,
      email: "admin@example.com",
      username: "JohnDoe",
      role: "headadmin",
      isAuthenticated: false,
    },
    {
      userId: 2,
      email: "editor@example.com",
      username: "JaneDoe",
      role: "admin",
      isAuthenticated: false,
    },
    // Add more mock users as needed
  ];
  
  let currentUser: User | null = null;
  
  export interface UserModel {
    login: (email: string, password: string) => boolean;
    isAuthenticated: () => boolean;
    logout: () => void;
    isStaff: () => boolean;
    getUser: () => User | null;
    getUsernameById: (userId: number) => string;
  }
  
  export const useMockAuth = (): UserModel => {
    // Function to simulate login
    const login = (email: string, password: string): boolean => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === "password") {
        user.isAuthenticated = true;
        currentUser = user;
        return true;
      }
      return false;
    };
  
    // Function to check if the user is authenticated
    const isAuthenticated = () => {
      return currentUser?.isAuthenticated ?? false;
    };
  
    // Function to check if the user is a staff member
    const isStaff = () => {
      return ["headadmin", "admin", "moderator"].includes(currentUser?.role ?? "");
    };
  
    // Function to simulate logout
    const logout = () => {
      if (currentUser) {
        currentUser.isAuthenticated = false;
        currentUser = null;
      }
    };
  
    // Function to get the current user
    const getUser = () => {
      return currentUser;
    };
  
    // Function to get a username by userId
    const getUsernameById = (userId: number): string => {
      const user = mockUsers.find(u => u.userId === userId);
      return user ? user.username : "Unknown";
    };
  
    return { login, isAuthenticated, logout, isStaff, getUser, getUsernameById };
  };
  