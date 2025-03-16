import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUsers, addUser } from '../services/airtableService';

// Create a context for user data
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For a hackathon demo, we'll use a mockup user
  // In a real app, you'd implement proper authentication
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        // Look for the default Hashi user or create one
        const users = await fetchUsers();
        let user = users.find(u => u.fields.Name === "Hashi");
        
        if (!user) {
          // Create a default user if none exists
          const newUser = {
            Name: "Hashi", // This matches the name in your UI
            Join_Date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          };
          
          user = await addUser(newUser);
        }
        
        setCurrentUser(user);
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Function to update user info if needed
  const updateUserInfo = (updatedInfo) => {
    setCurrentUser(prev => ({ ...prev, ...updatedInfo }));
  };
  
  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    updateUserInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};