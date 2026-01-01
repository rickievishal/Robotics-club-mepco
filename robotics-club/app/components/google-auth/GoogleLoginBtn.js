"use client"
import React, { useEffect } from 'react'
import { FaGoogle } from 'react-icons/fa6'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../api'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'

const GoogleLoginBtn = () => {
    const router = useRouter();
    const { login } = useAuth();
    useEffect(() => {
        const userProfile = JSON.parse(localStorage.getItem('userData'))
        if(userProfile){
            router.push('/club/welcome')
        }
    }, [])
    const handleAuthResponse = async(authRes) => {
        try{
            if(authRes['code']){
                try{
                    const result = await googleAuth (authRes['code']);
                    const {email,name,image,role} =result.data.user
                    const token = result.data.token
                    const userData = {email,name,image,role}
                    
                    // Use AuthProvider's login function to sync React state
                    login(userData, token)
                    window.dispatchEvent(new Event("login-success"));

                    router.push('/club/welcome');
                }catch(err){
                    // Google login failed
                }
            }
        }catch(err) {
            // Auth error
        }
    }
    const handleGoogleSiginUp = useGoogleLogin({
        onSuccess : handleAuthResponse,
        onError :handleAuthResponse,
        flow : "auth-code"
    })
  return (
    <button className='w-full px-4 py-2 bg-[var(--secondary)] text-[var(--background)] rounded-lg mt-8 flex gap-2 items-center justify-center hover:bg-gray-200 hover:cursor-pointer' onClick={handleGoogleSiginUp}>
        <FaGoogle /> <span className='mt-0.5'>Sign in with Google</span>
    </button>
  )
}

export default GoogleLoginBtn

