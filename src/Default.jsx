import React from 'react'
import Menu from './components/Menu'
import { Outlet } from 'react-router-dom'

const Default = () => {
  return (
    <>
        <Outlet />
        <Menu />
    </>
  )
}

export default Default