import React from 'react'
import Balance from '@/components/Balance'
function page() {
  return (
    <div className='p-4 text-4xl lg:mx-[300px] md:mx-[50px]'>
        <h3 className='opacity-40 font-semibold'>Crypto scan</h3><br />
        <Balance/>
    </div>
  )
}

export default page