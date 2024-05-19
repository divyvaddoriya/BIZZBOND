import React from 'react'
import { Link } from 'react-router-dom'



const CheckUser = () => {

    // const sp= new URLSearchParams(search)
    // const redirect= sp.get('redirect') || '/register'

  return (
    <div className='pl-[10rem] mt-[10rem]  flex-row justify-between space-y-6  '>

<h1 className='text-4xl font-bold font-serif' >How u want to register as</h1>
        
        <div className='flex gap-10'>

        <div className='bg-pink-500 text-lg p-[3rem] text-center text-white w-[9rem] '>
        <Link to='/register' state={{shopkeeper : false}}>
            User
        </Link>
        </div>
        <div className='bg-black text-lg p-[3rem] text-center text-white w-[9rem] '>
        <Link to='/register' state={{shopkeeper : true}}>
            Whole Seller
        </Link>
        </div>
       
        </div>
    </div>
  )
}

export default CheckUser