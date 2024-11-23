import {createContext, useState,useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
  const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const storedUser = localStorage.getItem('user');
        const storedTimestamp = localStorage.getItem('userTimestamp');

        if (storedUser && storedTimestamp) {
          const now = new Date().getTime();
          const timestamp = JSON.parse(storedTimestamp);

          // Check if 30 days have passed
          if (now - timestamp > THIRTY_DAYS_IN_MS) {
              // If 30 days have passed, clear the localStorage
              localStorage.removeItem('user');
              localStorage.removeItem('userTimestamp');
              return null;
          }

          return JSON.parse(storedUser);
      }

      return null;
  });
  
      useEffect(() => {
        // Update localStorage whenever user state changes
        if (user) {
          const timestamp = new Date().getTime();
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userTimestamp', JSON.stringify(timestamp));
      } else {
          localStorage.removeItem('user');
          localStorage.removeItem('userTimestamp');
      }
      }, [user]);
    const logout = () => {
        // Clear user state
        localStorage.removeItem('user');

        setUser(null);
      };
      console.log('UserContext: ',user);
    
    return (
        <UserContext.Provider value={{user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    )

}