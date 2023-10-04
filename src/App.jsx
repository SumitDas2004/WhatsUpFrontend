import './App.css'
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Contextwrapper from './components/AppContext/Contextwrapper';
import Appbody from './components/Appbody';

function App() {
  return (

    <GoogleOAuthProvider clientId="366213588806-c7nptko9pdsumb33hhmke0h57nn2qcd6.apps.googleusercontent.com">
      <Contextwrapper>
        <Appbody />
      </Contextwrapper>
    </GoogleOAuthProvider>
  )
}

export default App
