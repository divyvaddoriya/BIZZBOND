import React from 'react'
import { useState,useEffect } from 'react'

import { Link,useLocation , useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { setCredientials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import { useRegisterMutation } from '../../redux/api/usersApiSlice'
const Register = () => {

    const [username,setUsername] = useState('')
    const [email,setEmail]= useState('')
    const [password,setPassword]= useState('')
    const [confirmPassword,setConfirmPassword]= useState('')
    const [isShopKeeper,setIsShopKeeper] = useState(false)

    const dispatch = useDispatch()
    const navigate= useNavigate()

    const [register, {isLoading}] = useRegisterMutation()
    const {userInfo} = useSelector(state => state.auth)

    const {search,state} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

// console.log(typeof state.shopkeeper);


useEffect(()=>{
    if(userInfo){
        navigate(redirect)
    }
    
},[navigate,redirect,userInfo])

const submitHadler =  async(e)=>{
    console.log(state.shopkeeper);
    e.preventDefault()
        
    setIsShopKeeper(state.shopkeeper);
// console.log(isShopKeeper);
   
    if(password != confirmPassword){
        toast.error('password do not match')
    }
    else{
        try {
            console.log(isShopKeeper);
            const res = await register({username,email,password,isShopKeeper}).unwrap()
         
            dispatch(setCredientials({...res}))
                navigate(redirect)
                toast.success("user successfuly registered")
            } catch (error) {
                console.log(error);
                toast.error(error.data.message)
            }
        }
    }

  return (
    <section className='pl-[10rem] flex flex-wrap'>
        <div className='mr-[4rem] mt-[5rem]'>
            <h1 className="text-2xl font-semibold mb-4">
                Register
            </h1>

            <form onSubmit={submitHadler} action="" className='container w-[40rem] '>
                <div className='my-[2rem]'>
                    <label htmlFor="name" className='block text-sm font-medium text-black'>name</label>
                    <input type="text" id='name' className='mt-1 p-2 border rounded w-full ' placeholder='enter your name' value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className='my-[2rem]'>
                    <label htmlFor="email" className='block text-sm font-medium text-black'>email</label>
                    <input type="email" id='email' className='mt-1 p-2 border rounded w-full ' placeholder='enter your email' value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='my-[2rem]'>
                    <label htmlFor="password" className='block text-sm font-medium text-black'>password</label>
                    <input type="password" id='password' className='mt-1 p-2 border rounded w-full ' placeholder='enter your password' value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='my-[2rem]'>
                    <label htmlFor="confirmPassword" className='block text-sm font-medium text-black'>confirm password</label>
                    <input type="password" id='confirmPassword' className='mt-1 p-2 border rounded w-full ' placeholder='confirm password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>

<button disabled={isLoading} type='submit' className='bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]'>{isLoading ? "Registering..." : "Register"}</button>
{isLoading && <Loader />}
            </form>

            <div className='mt-4'>
                <p className='text-black'>
                    Already have an acoount ? {" "}
                    <Link to={redirect ? `/login?rediret=${redirect}` : '/login'} className='text-pink-500 hover:underline'>
                        Login
                    </Link>
                </p>
            </div>

        </div>
    </section>
  )
}

export default Register