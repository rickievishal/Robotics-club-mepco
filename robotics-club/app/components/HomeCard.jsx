import React from 'react'

const HomeCard = ({className}) => {
  return (
    <div className={` h-[400px] bg-[rgb(8,8,8)] rounded-lg  ${className} outline outline-[1px] outline-[var(--primary)]/20 `}>
        <div className='w-full h-[300px] bg-black rounded-sm overflow-hidden'>
            <img src="https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg" alt="hero" className='w-full h-full object-cover'/>
        </div>
        <div className='w-full px-2 py-2'>
            <h1 className='text-2xl text-[var(--primary)]'>
                Card Title
            </h1>
            <p className='text-slate-200'>
                Card sub title 
            </p>
        </div>
    </div>
  )
}

export default HomeCard