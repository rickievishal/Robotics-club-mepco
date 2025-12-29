import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const OauthWrapper = ({children}) => {
  return (
    <GoogleOAuthProvider clientId='208339977262-tqkcttsldtn8kat154sn7a4nco1fc9kt.apps.googleusercontent.com'>
        {children}
    </GoogleOAuthProvider>
  )
}

export default OauthWrapper