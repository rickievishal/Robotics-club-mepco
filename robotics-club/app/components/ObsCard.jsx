import React from 'react'

const ObsCard = ({data}) => {
  console.log(data)
  return (
    <div className='w-[300px] rounded-lg overflow-hidden  justify-center items-center'>
        <div className='w-full h-[350px] outline-[1px] outline-[var(--primary)]/20 rounded-lg overflow-hidden'>
            <img src={data?.imgUrl} className='w-full h-full object-cover' alt="" />
        </div>
        <p className='text-gray-200 text-center text-lg mt-2'>
            {data?.name}
        </p>
        <p className='text-gray-400 text-center'>
            {data?.role}
        </p>
    </div>
  )
}

export default ObsCard