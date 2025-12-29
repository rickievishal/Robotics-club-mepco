import React from 'react'

const Footer = () => {
  return (
    <div className='w-full flex justify-center items-center py-2 text-gray-200 font-light'>
        <p className='flex text-sm items-center justify-center'>
            Built with love by <a href='https://github.com/rickievishal' className='text-[var(--primary)] ml-1 hover:underline '>Heisenberg</a><span className='mt-1 ml-1'>❤️</span>
        </p>
    </div>
  )
}

export default Footer