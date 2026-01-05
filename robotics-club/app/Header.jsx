"use client"

import React, { useEffect } from 'react'
import LoginStatus from './components/Header-comps/LoginStatus'
import Link from 'next/link'
import { useAuth } from './hooks/useAuth'

const Header = () => {
  const { user, loading } = useAuth()

  const getNavigationLinks = () => {
    if (!user) {
      return (
        <>
          <li>
            <Link href={"/club/feed"}>
              <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                Feeds
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/club/events"}>
              <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                Events
              </button>
            </Link>
          </li>
        </>
      )
    }

    switch (user.role) {
      case 'member':
        return (
          <>
            <li>
              <Link href={"/club/events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Events
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/chatroom"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Chatroom
                </button>
              </Link>
            </li>
          </>
        )
      
      case 'officebearer':
        return (
          <>
            <li>
              <Link href={"/club/events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Events
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/chatroom"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Chatroom
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/obs/ob-tools/schedule-events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Manage Events
                </button>
              </Link>
            </li>
          </>
        )
      
      case 'admin':
        return (
          <>
            
            <li>
              <Link href={"/club/events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Events
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/chatroom"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Chatroom
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/admin"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Admin Dashboard
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/admin/users"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Manage Users
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/admin/events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Manage Events
                </button>
              </Link>
            </li>
          </>
        )
      
      default:
        return (
          <>
            <li>
              <Link href={"/club/feed"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Feeds
                </button>
              </Link>
            </li>
            <li>
              <Link href={"/club/events"}>
                <button className="text-[var(--primary)] px-4 py-1 rounded-lg hover:cursor-pointer hover:underline mr-2">
                  Events
                </button>
              </Link>
            </li>
          </>
        )
    }
  }

  return (
    <nav className='fixed top-0 w-full h-[50px] bg-black/50 backdrop-blur-3xl text-[var(--primary)] z-40'>
       <ol className='w-full h-full max-w-7xl mx-auto flex justify-between items-center px-2 sm:px-4'>
       <Link href={user ? "/club/welcome" : "/"}>
        <li className='text-xl font-bold tracking-[-1px] cursor-pointer'>
          RoboticsClub.
        </li>
        </Link>
        <ol className='flex justify-center items-center'>
          {getNavigationLinks()}
          <li>
            <LoginStatus/>
          </li>
        </ol>
       </ol>
    </nav>
  )
}

export default Header