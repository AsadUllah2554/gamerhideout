import {createContext, useState,useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      });
      useEffect(() => {
        // Update localStorage whenever user state changes
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);
    const logout = () => {
        // Clear user state
        setUser(null);
      };
      console.log('UserContext: ',user);
    
    return (
        <UserContext.Provider value={{user, setUser, logout}}>
            {children}
        </UserContext.Provider>
    )

}