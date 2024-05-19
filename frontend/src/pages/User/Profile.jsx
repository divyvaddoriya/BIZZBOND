import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { setCredientials } from '../../redux/features/auth/authSlice'
import { Link } from 'react-router-dom'
import { useProfileMutation } from '../../redux/api/usersApiSlice'
import { set } from 'mongoose'

const Profile = () => {

    const [ username, setUsername ]= useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isShopKeeper, setIsShopKeeper] = useState(true)
    const { userInfo } = useSelector(state => state.auth)

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()

    useEffect(() => {
        setUsername(userInfo.username);
        setEmail(userInfo.email)
        setIsShopKeeper(userInfo.isShopKeeper)
    }, [userInfo.username, userInfo.email, userInfo.isShopKeeper]);

    const dispatch = useDispatch();

    const submitHandler =async(e)=>{
        e.preventDefault();
        // console.log(password);
        // console.log(confirmPassword);
        // setIsShopKeeper(true)
        if( password !== confirmPassword){
            toast.error("password do not match")
        }
        else{
            try {
                const res= await updateProfile({_id: userInfo._id , username , email  ,password ,isShopKeeper}).unwrap()
                dispatch(setCredientials({ ...res }))
                toast.success("Profile Updated Successfully")
            } catch (error) {
                toast.error(error?.data?.message || error.message) 
            }
        }
    }

    return (
        
        <div className='container mx-auto p-4 mt-[5rem]'>
            <div className='flex justify-center align-center md:flex md:space-x-4 '>
                <div className="md:w-1/3">
                    <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
                    <form onSubmit={submitHandler} >
                        <div className="mb-4 ">
                            <label  className='block border-blue-900 text-black mb-2'>
                                Name
                            </label>
                            <input type="text" 
                            placeholder='Enter name' 
                            className='form-input border-blue-400 bg-gray-900 text-white  p-4 rounded-sm w-full ' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-4 ">
                            <label className='block border-blue-900 text-black mb-2'>
                                Email
                            </label>
                            <input type="email" 
                            placeholder='Enter Email' 
                            className='form-input border-blue-400 bg-gray-900 text-white  p-4 rounded-sm w-full ' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4 ">
                            <label className='block border-blue-900 text-black mb-2'>
                                Password
                            </label>
                            <input type="password" 
                            placeholder='Enter Password' 
                            className='form-input border-blue-400 bg-gray-900 text-white  p-4 rounded-sm w-full ' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-4 ">
                            <label  className='block border-blue-900 text-black mb-2'>
                             Confirm Password
                            </label>
                            <input type="password" 
                            placeholder='Confirm Password' 
                            className='form-input border-blue-400 bg-gray-900 text-white  p-4 rounded-sm w-full ' 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className='flex justify-between'>
                            <button type='submit' className='bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600'>Update</button>
                            <Link to={'/user-orders'} className='bg-pink-600 text-white py-2 px-5 rounded hover:bg-pink-700'>
                                My Orders
                            </Link>
                        </div>
                    </form>
                </div>

{loadingUpdateProfile && <Loader />}

            </div>
        </div>

    )
}

export default Profile