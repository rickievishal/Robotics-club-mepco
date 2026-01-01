"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const LoginStatus = () => {
    const [cookie,setCookie] = useState(null)
    const router = useRouter()
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    useEffect(() => {
        const updateCookie = () => {
        const user = JSON.parse(localStorage.getItem("userData"));
                setCookie(user);
        };

        updateCookie(); // Run once on mount

        window.addEventListener("login-success", updateCookie); // 🔁 Manual event
        window.addEventListener("storage", updateCookie);       // For other tabs

        return () => {
            window.removeEventListener("login-success", updateCookie);
            window.removeEventListener("storage", updateCookie);
        };
    }, []);


    const handleLogin = () => {
        localStorage.removeItem("userData")
        localStorage.removeItem("token")
        router.push('/register')
    }
    const handleLogout = () =>{
        localStorage.removeItem("userData")
        localStorage.removeItem("token")
        setCookie(null);
        window.location.reload()
    }
  return (
    <>
    {cookie ? (
        <div
            className="w-[50px] h-[60px] relative flex justify-center"
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
        >
            <div className="w-[30px] h-[30px] rounded-full overflow-hidden absolute top-4 bg-[var(--primary)]">
            <img
                src={cookie.name}
                alt={cookie.name}
                className="w-full h-full object-cover"
            />
            </div>

            {isProfileHovered && (
            <div className="bg-[var(--background-light)] px-2 py-2 rounded-lg absolute top-[55px] right-0 flex flex-col gap-2 items-start justify-start shadow-lg z-50">
                
                <button
                className="px-6 py-2 bg-[var(--background)] text-[var(--primary)] rounded-lg border border-[var(--primary)]/20   hover:bg-gray-950 cursor-pointer"
                onClick={handleLogout}
                >
                Logout
                </button>
            </div>
            )}
        </div>
        ) : (
        <button
            className="px-4 py-1 rounded-lg border border-[rgba(159,159,159,0.38)] bg-black hover:bg-gray-900 cursor-pointer"
            onClick={handleLogin}
        >
            Login
        </button>
        )}

    </>
  )
}

export default LoginStatus