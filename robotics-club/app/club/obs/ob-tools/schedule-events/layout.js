import AdminAuth from '@/app/components/Authenticate-comp/AdminAuth'
import React from 'react'

const layout = ({children}) => {
  return (
    <AdminAuth>
        {children}
    </AdminAuth>
  )
}

export default layout