import React from 'react'
import { Button } from './ui/button'

function Navbar() {
  return (
    <div className='p-4 text-4xl lg:mx-[300px] md:mx-[50px]  my-2 flex justify-between '>
        <div>
            <h2 className='font-bold inline'>Cryptoket </h2>
            <span className='text-sm font-bold '>beta</span>
            
            <p className='text-xs opacity-40 mt-2'>A Simple & and Secure Web3 Wallet</p>
        </div>
        <div className='text-xl cursor-pointer'>
            {/* <Button variant="outline">Profile</Button> */}
        </div>
       
    </div>
  )
}

export default Navbar