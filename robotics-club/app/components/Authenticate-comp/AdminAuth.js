"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AdminAuth = ({children}) => {
    const [isAdmin,setIsAdmin] = useState(false)
    const router = useRouter();
    useEffect(()=>{
        const cookie = JSON.parse(localStorage.getItem("user-info"))
        setIsAdmin()
        console.log(cookie?.role)
        if (!(cookie?.role === "admin")){
            setIsAdmin(false)
            // router.push("/")
        }else{
            setIsAdmin(true)
        }
    },[])
    
//   return isAdmin ? children : null
     return children;
}

export default AdminAuth