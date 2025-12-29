import React from 'react'

const Input = ({label = "Label",placeholder="placeholder",name="name",className,onChange,value}) => {
  return (
    <div className='inline-flex flex-col max-w-xl'>
        <label className="text-lg text-[var(--foreground)]/80" htmlFor={name}>{label}</label>
        <input value={value} name={name} onChange={onChange} placeholder={placeholder} className={`${className} border-[1px] text-xl border-white/15 rounded-lg py-2 px-4 outline-none focus:border-[var(--primary)] mt-2`}/>
    </div>
  )
} 

export default Input