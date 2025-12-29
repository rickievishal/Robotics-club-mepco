"use client"
import Button from '@/app/components/Button'
import Input from '@/app/components/Input'
import Link from 'next/link'
import React, { useState } from 'react'

const page = () => {
  const [currParticipant,setCurrentParticipant] = useState("")
  const [currList,setCurrList] = useState([]);
  const removeParticipants = (id) => {
    
  }
  const onParticipantAdd = (e) => {
    e.preventDefault();
    setCurrList((curr) => [...curr,currParticipant]);
    setCurrentParticipant("");
    console.log("null")
  }
  return (
    <div className='w-full text-slate-300  pt-24 '>
       <div className='max-w-7xl mx-auto grid grid-cols-3'>
          <div className='col-span-3 mb-4' >
            <Link href={"/"} className='text-black bg-[var(--primary)] px-3 py-2 rounded-r-full rounded-l-full'>
              Back
            </Link>          
          </div>
          <div className='col-span-1'>
            <div className='w-full h-[400px] border border-white/15 rounded-lg overflow-hidden'>
              <img className='w-full h-full object-cover' src='https://i.pinimg.com/736x/c3/a9/27/c3a927ca97d4f83d7918e4a4cd2deb0d.jpg'/>
            </div>
          </div>
          <div className='col-span-2 px-4'>
              <h1 className='text-2xl text-[var(--primary)]'>
                Scheldule A Event.
              </h1>
              <form className='mt-4 flex flex-col gap-y-4'>
                <Input label='Event Name'/>
                <Input label='Venue'/>
                <Input label='Description'/>
                <div className='flex items-end'>
                  <Input onChange={(e)=> setCurrentParticipant(e.target.value)} label='Participants' className={"mr-2"} value={currParticipant}/>
                  <button className='text-black bg-[var(--primary)] hover:bg-[var(--primary)]/90 h-[45px] hover:cursor-pointer rounded-lg px-4' onClick={(e)=>onParticipantAdd(e)}>
                    Add
                  </button>
                </div>
                <div className='flex flex-col'>
                    {
                      currList.map((participant)=>{
                        return <div className='flex'> <p className='text-lg '>{participant}</p> </div>;
                      }
                      )
                    }
                </div>
                <button className={"px-8 py-2 bg-[var(--primary)] rounded-lg text-black max-w-[250px] hover:cursor-pointer"}>
                  Submit
                </button>
              </form>
          </div>
       </div>
    </div>
  )
}

export default page