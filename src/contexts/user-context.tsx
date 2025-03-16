import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { fetchUsers, addUser } from '../../Airtable/airtableService';

// Define types for the user object and context value
interface User {
  id: string;
  fields: {
    Name: string;
    Join_Date: string;
  };
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>; // Keep it flexible for any fields, but still allow access to Name and Join_Date
}

interface UserContextType {
  currentUser: User | null;
  loading: boolean;
  updateUserInfo: (updatedInfo: Partial<User>) => void;
}

// Create a context with a default value of `undefined`
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize user (mockup or fetch from the API)
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        const users = await fetchUsers();
        let user: AirtableRecord | null = users.find((u: AirtableRecord) => u.fields.Name === "Hashi");

        if (!user) {
          const newUser = {
            Name: "Hashi",
            Join_Date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          };
          user = await addUser(newUser);
        }

        // Ensure user is not null and match the User interface
        if (user) {
          const userData: User = {
            id: user.id,
            fields: {
              Name: user.fields.Name,
              Join_Date: user.fields.Join_Date,
            },
          };
          setCurrentUser(userData); // Set the user data
        } else {
          setCurrentUser(null); // Set to null if user is undefined
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setCurrentUser(null); // Set to null if an error occurs
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Function to update user info
  const updateUserInfo = (updatedInfo: Partial<User>) => {
    if (updatedInfo) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updatedInfo } : null)); // Set to null if updatedInfo is undefined or null
    } else {
      setCurrentUser(null); // Set to null if updatedInfo is undefined
    }
  };

  // Provide context value
  const value = {
    currentUser,
    loading,
    updateUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};