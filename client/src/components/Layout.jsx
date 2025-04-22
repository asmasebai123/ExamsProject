import Navbar from './Navbar'
import Footer from './Footer'
import React from 'react'


const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout