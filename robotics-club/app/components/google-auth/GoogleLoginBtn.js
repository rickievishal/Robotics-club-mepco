"use client"
import React, { useEffect } from 'react'
import { FaGoogle } from 'react-icons/fa6'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../api'
import { useRouter } from 'next/navigation'

const GoogleLoginBtn = () => {
    const router = useRouter();
    useEffect(() => {
        const userProfile = JSON.parse(localStorage.getItem('user-info'))
        if(userProfile){
            router.push('/club/welcome')
        }
    }, [])
    const handleAuthResponse = async(authRes) => {
        console.log(authRes)
        try{
            if(authRes['code']){
                console.log(authRes['code'])
                try{
                    console.log(authRes['code'])
                    const result = await googleAuth (authRes['code']);
                    console.log(result.data)
                    const {email,name,image,role} =result.data.user
                    console.log("result : ",result.data.user)
                    const token = result.data.token
                    const obj = {email,name,image,token,role}
                    localStorage.setItem("user-info",JSON.stringify(obj))
                    const data = localStorage.getItem("user-info")
                    window.dispatchEvent(new Event("login-success"));

                    console.log(data);
                    router.push('/club/welcome');
                }catch(err){
                    console.log(err)
                }
            }
        }catch(err) {
            console.log(err)
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