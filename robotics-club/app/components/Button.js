"use client"
import { AnimatePresence ,motion} from 'framer-motion'
import React, { useState } from 'react'
import { GoArrowUpRight } from "react-icons/go";
const Button = ({onClick,className,children}) => {
 const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="absolute inline-flex items-center justify-center gap-2 w-auto  px-4 py-4 bg-[rgb(41,255,3)] text-white rounded-full overflow-hidden hover:cursor-pointer hover:bg-[rgba(0,0,0,0.45)] backdrop-blur-md hover:border-t-1 hover:border-b-1 hover:border-b-[rgba(194,194,194,0.21)] hover:border-[rgba(255,255,255,0.3)] hover:text-green-500 group active:scale-95"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <GoArrowUpRight className='text-xl mt-0.5 text-black group-hover:text-green-500' />
      <AnimatePresence>
        {hovered && (
          <motion.span
            layout
            initial={{ opacity: 0, x: -5, }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xl"
          >
            <p className='tracking-tighter pl-1 pr-4 font-semibold '>
                {children}
            </p>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
export default Button