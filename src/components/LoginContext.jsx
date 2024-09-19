import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

// Create a Context for the login state
export const AuthContext = createContext();

// Custom hook for consuming the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const [name, setName] = useState(() => {
    const firstName = sessionStorage.getItem('firstName') || '';
    const lastName = sessionStorage.getItem('lastName') || '';
 
    if (firstName === "Jouni" && lastName === "Riimala"){
      sessionStorage.setItem("adminLevel", "valid")
    }

    return `${firstName} ${lastName}`.trim();
  });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  async function initializeUser(user) {
    if (user) {
      console.log('Context user: ', user);
      setCurrentUser(user); // Avoid shallow copy to preserve Firebase methods
      setIsLoggedIn(true);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    name,
    setIsLoggedIn,
    setCurrentUser,
    isLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
