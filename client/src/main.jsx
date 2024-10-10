import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MantineProvider } from '@mantine/core';
import { UserContextProvider } from './context/userContext.jsx';
import { PostContextProvider } from './context/postContext.jsx';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// serviceWorkerRegistration.register();


ReactDOM.createRoot(document.getElementById('root')).render(
 
    <MantineProvider>
    <PostContextProvider>
    <UserContextProvider>
      <App />
    </UserContextProvider>  
    </PostContextProvider>
    </MantineProvider>
 
)
