"use client"
import BlurText from '@/app/components/Animated-comps/BlurText'
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute'
import { useAuth } from '@/app/hooks/useAuth'
import React, { useEffect, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { BsArrowUpRight } from "react-icons/bs";
import { motion } from 'framer-motion'
import Link from 'next/link'

const Page = () => {
  const { user } = useAuth()
  const [userCookie, setUserCookie] = useState(null)
  const [isAnimationComplete,setIsAnimationComplete] =useState(false)
  
  useEffect(() => {
    const cookieData = JSON.parse(localStorage.getItem("user-info"))
    setUserCookie(cookieData)
  }, [])

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true)
  }
  
  const confettiAnimation = {
      particleSize : 10,
      force: 1,
      duration: 2500,
      particleCount: 80,
      width: 1600,
  }

  // Role-based welcome message
  const getRoleWelcomeMessage = (role) => {
    switch (role) {
      case 'member':
        return 'Welcome to the Robotics Club!'
      case 'officebearer':
        return 'Welcome, Officebearer!'
      case 'admin':
        return 'Welcome, Administrator!'
      default:
        return 'Welcome to the Robotics Club!'
    }
  }

  // Role-based explore link
  const getExploreLink = (role) => {
    switch (role) {
      case 'member':
        return '/club/events'
      case 'officebearer':
        return '/club/events'
      case 'admin':
        return '/club/admin/users'
      default:
        return '/club/events'
    }
  }

  const getExploreText = (role) => {
    switch (role) {
      case 'member':
        return 'View Events'
      case 'officebearer':
        return 'Manage Events'
      case 'admin':
        return 'Manage Users'
      default:
        return 'Explore'
    }
  }

  if (!user || !userCookie) return <div>Loading...</div>

  return (
    <RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
      <div className='w-full h-screen flex flex-col justify-center items-center relative  '>
          <div className='h-[600px] w-[50px] bg-green-500/50 blur-[100px] absolute -top-[20%] left-[50%] rotate-45'></div>

          {isAnimationComplete && (<ConfettiExplosion {...confettiAnimation} className='absolute -top-[20%]'/>)}
          
          <motion.span initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:1 ,duration: 1,ease:"circInOut"}} className='text-2xl tracking-[-2px]'>
              <ShinyText text={getRoleWelcomeMessage(user.role)}></ShinyText>✨
          </motion.span>
          
          <div className=' flex flex-col inline items-center justify-center'>
              <BlurText
                  text="The Robotics Club."
                  delay={200}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="font-bold text-7xl tracking-[-4px] mt-2 text-green-400"
              />
              <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:1.5 ,duration: 1,ease:"circInOut"}} className='flex justify-center items-center'>
                <p className='text-sm px-4 inline-block text-gray-400 mt-2'>
                 Established under the aegis of MEPCO Schlenk Engineering College
                </p>
              </motion.div>
          </div>
          
          <Link href={getExploreLink(user.role)}>
            <motion.button initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:2 ,duration: 1,ease:"circInOut"}} className='px-4 py-1 text-lg bg-[var(--primary)] text-black mt-8 flex items-center hover:cursor-pointer '>
                {getExploreText(user.role)} <BsArrowUpRight className='text-lg ml-1' />
            </motion.button>
          </Link>
      </div>
    </RoleProtectedRoute>
  )
}

export default Page
