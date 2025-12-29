"use client"
import ShinyText from '@/app/components/Animated-comps/ShinyText'
import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
const page = () => {
    const [isEventViewed,setIsEventViewed] = useState(false)
    const handleEventClose = () => {
        setIsEventViewed(false)
    }
    const handleEventOpen = () => {
        setIsEventViewed(true)
    }
  return (
    <div className='w-full pt-[50px] tracking-tighter relative'>
        {
            isEventViewed && (
              <>
              <div className='w-screen h-screen flex justify-center items-center fixed top-0 left-0 bg-black/30 z-30'>
                <div className='w-full h-full sm:max-w-2xl lg:max-w-4xl sm:max-h-[700px] bg-black px-4 sm:px-8 z-40 py-[50px] flex justify-start items-center sm:items-start relative rounded-lg border border-white/10'>
                    <div className='w-[35px] h-[35px] bg-[var(--primary)] border border-white/20 absolute top-16 right-2 sm:top-4 sm:right-4 rounded-full flex justify-center items-center hover:cursor-pointer'onClick={handleEventClose} >
                            <IoMdClose className='text-black text-xl' />
                    </div>
                    <div className='w-full h-full grid grid-cols-3 pt-8 lg:pt-0 '>
                        
                        <div className='col-span-3 sm:col-span-1 rounded-lg overflow-hidden border-[1px] border-white/15' >
                            <img className='w-full h-full object-cover' src='https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'/>
                        </div>
                        <div className='flex col-span-3 sm:col-span-2 flex-col text-[rgb(155,155,155)] sm:pl-8 mt-4'>
                            <ShinyText text={"Event Details"}/>
                            <h2 className='text-2xl font-bold text-[var(--primary)]'>Robo Fest 2024</h2>
                            <h3 className='text-lg font-bold  mt-2'>
                                description
                            </h3>
                            <p className=''>
                                It s fundamental course on how to get the robot to function using node js and cpp.
                            </p>
                            <p className='font-bold mt-2'>
                                Hosted By
                            </p>
                            <ol>
                                <li>
                                    <p>
                                        Vishal ECE C
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Kaushik Mubesh ECE C
                                    </p>
                                </li>
                            </ol>
                            <h3 className='text-lg font-bold  mt-2'>
                                Venue
                            </h3>
                            <p className=''>
                                EF01
                            </p>
                            <h3 className='text-lg font-bold  mt-2'>
                                Date
                            </h3>
                            <p className=''>
                                23 Sep 2025
                            </p>
                        </div>
                    </div>
                    
                </div>
              </div>
              </>
            )
        }
        <div className='w-[10px] h-[350px] bg-[var(--primary)] absolute top-0 left-[50%] -translate-y-4 rotate-45 blur-[60px] z-10'>

        </div>
        <div className='max-w-2xl lg:max-w-5xl mx-auto px-2 py-16 flex flex-col justify-center items-center z-20'>
            <div className='w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center'>
                <h1 className='text-2xl font-bold text-[rgb(155,155,155)]'>
                   👀 What's Happening Today 
                </h1>
                <ShinyText className='text-lg' text={"Today's Events"}/>
            </div>
            <div className='w-full flex flex-wrap items-center justify-center z-20'> 
                <div className='w-full flex justify-start items-start text-[rgb(155,155,155)] mt-4'>
                    <p className='text-lg ml-2 '>
                        July 3
                    </p>
                </div>
                <div className='w-full flex flex-wrap items-center justify-start'>
                    <div className='sm:max-w-[300px] w-full  sm:max-h-[400px] flex flex-col items-start justify-items-start bg-[rgb(13,13,13)] border-[rgb(29,29,29)] border-[1px] rounded-lg m-2 p-2 hover:cursor-pointer' onClick={handleEventOpen}>
                        <div className='w-full h-[400px] sm:h-[300px] bg-[rgb(19,19,19)] rounded-sm border-[1px] border-[rgb(29,29,29)]'>
                            <img className='w-full h-full object-cover' src='https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'/>
                        </div>
                       <div className='w-full flex flex-col p-1'>
                            <p className='mt-2 text-xl font-bold text-[rgb(163,163,163)] leading-tight'>
                                Robot Fest 2024 👄
                            </p>
                            <div className='w-full flex justify-between items-center'>
                                <p className=' text-sm font-bold text-[rgb(163,163,163)]  leading-tight'>
                                    Venue : <span className='font-normal'>EF01</span>
                                </p>
                                <p className='text-[var(--primary)]/60 px-2 border border-[rgb(163,163,163)]/20 bg-black rounded-lg'>
                                    23 Sep
                                </p>
                            </div>
                       </div>
                    </div>
                    
                </div>
            </div>  
            <div className='w-full flex flex-col-reverse sm:flex-row justify-between sm:items-center mt-16'>
                <h1 className='text-2xl font-bold text-[rgb(155,155,155)]'>
                   Have a look at What's cookin
                </h1>
                <ShinyText className='text-lg' text={"Upcoming Events"}/>
            </div>
            <div className='w-full flex flex-wrap items-center justify-center z-20'> 
                <div className='w-full flex justify-start items-start text-[rgb(155,155,155)] mt-4'>
                    July 5
                </div>
                <div className='w-full flex flex-wrap items-center justify-start'>
                    
                    <div className='sm:max-w-[300px] w-full  sm:max-h-[400px] flex flex-col items-start justify-items-start bg-[rgb(13,13,13)] border-[rgb(29,29,29)] border-[1px] rounded-lg m-2 p-2 '>
                        <div className='w-full h-[400px] sm:h-[300px] bg-[rgb(19,19,19)] rounded-sm border-[1px] border-[rgb(29,29,29)]'>
                            <img className='w-full h-full object-cover' src='https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'/>
                        </div>
                       <div className='w-full flex flex-col p-1'>
                            <p className='mt-2 text-xl font-bold text-[rgb(163,163,163)] leading-tight'>
                                Robot Fest 2024 👄
                            </p>
                            <div className='w-full flex justify-between items-center'>
                                <p className=' text-sm font-bold text-[rgb(163,163,163)]  leading-tight'>
                                    Venue : <span className='font-normal'>EF01</span>
                                </p>
                                <p className='text-[var(--primary)]/60 px-2 border border-[rgb(163,163,163)]/20 bg-black rounded-lg'>
                                    23 Sep
                                </p>
                            </div>
                       </div>
                    </div>
                </div>
            </div>  <div className='w-full flex flex-wrap items-center justify-center z-20'> 
                <div className='w-full flex justify-start items-start text-[rgb(155,155,155)] mt-4'>
                    July 16
                </div>
                <div className='w-full flex flex-wrap items-center justify-start'>
                   <div className='sm:max-w-[300px] w-full  sm:max-h-[400px] flex flex-col items-start justify-items-start bg-[rgb(13,13,13)] border-[rgb(29,29,29)] border-[1px] rounded-lg m-2 p-2 '>
                        <div className='w-full h-[400px] sm:h-[300px] bg-[rgb(19,19,19)] rounded-sm border-[1px] border-[rgb(29,29,29)]'>
                            <img className='w-full h-full object-cover' src='https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'/>
                        </div>
                       <div className='w-full flex flex-col p-1'>
                            <p className='mt-2 text-xl font-bold text-[rgb(163,163,163)] leading-tight'>
                                Robot Fest 2024 👄
                            </p>
                            <div className='w-full flex justify-between items-center'>
                                <p className=' text-sm font-bold text-[rgb(163,163,163)]  leading-tight'>
                                    Venue : <span className='font-normal'>EF01</span>
                                </p>
                                <p className='text-[var(--primary)]/60 px-2 border border-[rgb(163,163,163)]/20 bg-black rounded-lg'>
                                    23 Sep
                                </p>
                            </div>
                       </div>
                    </div>
                    
                </div>
            </div>  
        </div>
    </div>
  )
}

export default page