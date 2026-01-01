"use client"
import React, { useRef, useState } from 'react'
import {motion, scale} from "framer-motion"
import { GoArrowUpRight } from "react-icons/go";
import Button from './Button';
import { useRouter } from 'next/navigation';
const HeroOverlay = () => {
    const router = useRouter()
    const [heroHandle,setHeroHandle] = useState(true)
    const containerRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
    };
  const handleJoinBtn = () => {
    router.push('/register')
  }
  return (
    <motion.div  ref={containerRef}
      onMouseMove={handleMouseMove} className="absolute w-screen flex flex-col justify-center items-center top-0 translate-middle ">
         <div className='relative w-screen h-screen' onMouseEnter={() => setHeroHandle(true)} onMouseLeave={() => setHeroHandle(false)}>
          <motion.div className="inline-flex -tracking-[3px] rounded-r-full rounded-l-full px-4 py-1 shadow-lg relative"
            animate={{ x: pos.x - 50, y: pos.y - 20 }}
            transition={{duration : .2}}
            >
                <Button onClick={handleJoinBtn}>
                     Joindaclub.
                </Button>
            </motion.div>
        </div>
      </motion.div>
  )
}

export default HeroOverlay