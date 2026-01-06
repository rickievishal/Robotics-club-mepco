import React from 'react'
import { FaGoogle } from "react-icons/fa6";
import { PiSealCheckFill } from "react-icons/pi";
import GoogleLoginBtn from '../components/google-auth/GoogleLoginBtn';
import EmailAuth from '../components/EmailAuth';

const page = () => {
  return (
    <div className='w-screen py-[100px] flex justify-center items-center px-4 bg-[var(--baclground)] tracking-[-1px] overflow-x-hidden'>
          <div className='max-w-4xl w-full rounded-lg relative overflow-hidden grid grid-cols-2 justify-center shadow-lg border-[1px] border-[rgba(255,255,255,0.13)] bg-[var(--background)]'>
            <div className='hidden sm:block col-span-1 bg-[var(--background)]'>
                <img className='w-full h-full object-cover' src='https://hips.hearstapps.com/altaonline/wp-content/uploads/2018/11/ATA010819jobs_img01.jpg?resize=980:*'/>
            </div>
            <div className='w-full h-full max-h-[150px] col-span-2 sm:hidden bg-[var(--background)] overflow-hidden'>
                <img className='w-full h-full object-cover' src='https://hips.hearstapps.com/altaonline/wp-content/uploads/2018/11/ATA010819jobs_img01.jpg?resize=980:*'/>
            </div>
            <div className='h-full w-full text-[var(--text))] col-span-2 sm:col-span-1 bg-[var(--background)] px-4 lg:px-8 lg:py-8 flex flex-col justify-start items-start relative'>
             <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 rotate-[15deg] w-[600px] h-[80px] bg-gradient-to-r from-transparent via-green-300/90 to-transparent opacity-60 blur-3xl mix-blend-screen z-0"></div>

              <h1 className='text-2xl font-thin sm:mt-8 '>
                Robotics Club Login.
              </h1>
              <p className='text-5xl text-green-500 mb-4'>
                #Join da Club.
              </p>
              <p>By signing up, you guys get to exprience 😆</p>
              {/* <ol className='text-lg'>
                <li>
                  <span className='flex gap-2 items-center'>
                    <PiSealCheckFill className='text-[var(--primary)]'/> Internships.
                  </span>
                </li>
                <li>
                  <span className='flex gap-2 items-center'>
                    <PiSealCheckFill className='text-[var(--primary)]'/> Hackathons.
                  </span>
                </li>
                <li>
                  <span className='flex gap-2 items-center'>
                    <PiSealCheckFill className='text-[var(--primary)]'/> RoboFest.
                  </span>
                </li>
                <li>
                  <span className='flex gap-2 items-center'>
                    <PiSealCheckFill className='text-[var(--primary)]'/> Placement Guidance and much more.
                  </span>
                </li>
              </ol> */}
              
              {/* Email/Password Authentication */}
              <EmailAuth />
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/20"></div>
                <div className="px-4 text-sm text-gray-400">OR</div>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
              
              {/* Google OAuth */}
              <div className="w-full">
                <GoogleLoginBtn />
              </div>
              
              <p className='text-left leading-4 mt-4 text-xs'>
                We suggest you guys to use your educational institutes emails for the signup process.
              </p>
            </div>
          </div>
    </div>
  )
}

export default page
