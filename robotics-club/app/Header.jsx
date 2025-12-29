import React from 'react'
import LoginStatus from './components/Header-comps/LoginStatus'
import Link from 'next/link'

const Header = () => {

  return (
    <nav className='fixed top-0 w-full h-[50px] bg-black/50 backdrop-blur-3xl text-[var(--primary)] z-40'>
       <ol className='w-full h-full max-w-7xl mx-auto flex justify-between items-center px-2 sm:px-4'>
       <Link href="/">
        <li className='text-xl font-bold tracking-[-1px] '>
          RoboticsClub.
        </li>
        </Link>
        <ol className='flex justify-center items-center'>
          <li>
            <Link href={"/club/feed"}>
            <button className="text-[var(--primary)] px-4 py-1  rounded-lg hover:cursor-pointer hover:underline mr-2">
              Feeds
            </button>
          </Link>
          </li>
          <li>
            <Link href={"/club/events"}>
            <button className="text-[var(--primary)] px-4 py-1  rounded-lg hover:cursor-pointer hover:underline mr-2">
              events
            </button>
          </Link>
          </li>
          <li>
            <Link href={"/club/chatroom"}>
            <button className="text-[var(--primary)] px-4 py-1  rounded-lg hover:cursor-pointer hover:underline mr-2">
              chatroom
            </button>
          </Link>
          </li>
          <li>
            <Link href={"/club/obs/ob-tools/schedule-events"}>
            <button className="text-[var(--primary)] px-4 py-1  rounded-lg hover:cursor-pointer hover:underline mr-2">
              add events
            </button>
          </Link>
          </li>
          <li>
            <LoginStatus/>
          </li>
        </ol>
       </ol>
    </nav>
  )
}

export default Header