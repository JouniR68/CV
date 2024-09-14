import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase"

// Create a Context for the login state
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState(sessionStorage.getItem("firstName") + ' ' + sessionStorage.getItem("lastName"))
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser)
    return unsubscribe
  }, [])

  async function initializeUser(user) {
    if (user) {
      console.log("Context user: ", user)
      setCurrentUser({ ...user })
      setIsLoggedIn(true)
    }
    else {
      setCurrentUser(null)
      setIsLoggedIn(false)
    }
    setLoading(false)
  }

  const value = {
    currentUser,
    name,
    setIsLoggedIn,
    setCurrentUser,
    isLoggedIn,
    loading
  }

  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
