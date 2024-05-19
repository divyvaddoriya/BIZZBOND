import React from 'react'
import { useState } from 'react'
import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../redux/api/usersApiSlice'
import { logout } from '../../redux/features/auth/authSlice'


const Navigation = () => {

    const { userInfo } = useSelector(state => state.auth)

    const [dropDownOpen, setdropDownOpen] = useState(false)
    const [showSideBar, setshowSideBar] = useState(false)

    const toggleDropDown = () => {
        setdropDownOpen(!dropDownOpen)
    }
    const toggleSideBar = () => {
        setshowSideBar(!showSideBar)
    }
    const closeSideBar = () => {
        setshowSideBar(false)
    }

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout());
            navigate('/login');
        }
        catch (error) {
            console.error(error);
        }
    }

    return (

        <div style={{ zIndex: 999 }} className={`${showSideBar ? "hidden" : "flex"}  xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
            id='navigation-container'>
            <div className="flex flex-col justify-center space-y-14 ">
                <Link to='/' className='flex items-center transition-transform transform hover:translate-x-2'>
                    <AiOutlineHome size={26} className='mr-2 mt-[3rem' />
                    <span className="hidden nav-item-name mt-[3rem">HOME</span>{" "}
                </Link>
                <Link to='/shop' className='flex items-center transition-transform transform hover:translate-x-2'>
                    <AiOutlineShopping size={26} className='mr-2 mt-[3rem' />
                    <span className="hidden nav-item-name mt-[3rem">SHOP</span>{" "}
                </Link>
                <Link to='/cart' className='flex items-center transition-transform transform hover:translate-x-2'>
                    <AiOutlineShoppingCart size={26} className='mr-2 mt-[3rem' />
                    <span className="hidden nav-item-name mt-[3rem">CART</span>{" "}
                </Link>
                <Link to='/favorite' className='flex items-center transition-transform transform hover:translate-x-2'>
                    <FaHeart size={26} className='mr-2 mt-[3rem' />
                    <span className="hidden nav-item-name mt-[3rem">Favourite</span>{" "}
                </Link>
            </div>

            <div className="relative">
                <button onClick={toggleDropDown} className='flex items-center text-gray-8000 focus:outline-none'>
                    {userInfo ? <span className='test-white'>{userInfo.username}</span> : <></>}
                    {
                        userInfo && (
                            <svg
                                xmlns='https://www.w3.org/2000/svg'
                                className={`h-4 w-4 ml-1 ${dropDownOpen ? "transform rotate-180 " : ""
                                    }`}
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='white'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth="2"
                                    d={dropDownOpen ? "M5 15L7-7 7 7" : "M19 9l-7 7-7-7"}
                                />
                            </svg>
                        )
                    }
                </button>
                {dropDownOpen && userInfo && (
                    <ul className={` right-0 absolute mt-2 mr-14 space-y-2 bg-white text-gray-600 ${(!userInfo.isAdmin && !userInfo.isShopKeeper)? '-top-20' : '-top-80'}`}>
                        
                                                
                        {!userInfo.isAdmin && userInfo.isShopKeeper && (
                            <>
                             <li>
                                <Link to={'/wholeseller/dashboard'} className='block px-4 py-2 hover:bg-gray-100'>
                                 Dashboard
                                </Link>
                            </li>
                             <li>
                                <Link to={'/wholeseller/dashboard'} className='block px-4 py-2 hover:bg-gray-100'>
                                   Orders
                                </Link>
                            </li>
                             <li>
                                <Link to={'/wholeseller/dashboard'} className='block px-4 py-2 hover:bg-gray-100'>
                                   OrderList
                                </Link>
                            </li>
                            </>
                        )}
                        

                        {userInfo.isAdmin && (<>
                            <li>
                                <Link to={'/admin/dashboard'} className='block px-4 py-2 hover:bg-gray-100'>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/productlist'} className='block px-4 py-2 hover:bg-gray-100'>
                                    products
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/categorylist'} className='block px-4 py-2 hover:bg-gray-100'>
                                    Category
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/orderlist'} className='block px-4 py-2 hover:bg-gray-100'>
                                    orders
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/userlist'} className='block px-4 py-2 hover:bg-gray-100'>
                                    users
                                </Link>
                            </li>

                        </>)}

                        <li>
                            <Link to={'/profile'} className='block px-4 py-2 hover:bg-gray-100'>
                                profile
                            </Link>
                        </li>
                        <li>
                         
                            <button
                            onClick = { (logoutHandler)}
                            
                            className='block w-full px-4 py-2 text-left hover:bg-gray-100'>
                                Logout
                            </button>
                                   
                        </li>

                      

                       

                    </ul>
                )}

    {
                !userInfo && (

                    <ul className='space-y-14'>
                        <li>
                            <Link to='/login' className='flex items-center transition-transform transform hover:translate-x-2'>
                                <AiOutlineLogin size={26} className='mr-2 mt-[3rem' />
                                <span className="hidden nav-item-name mt-[3rem">Login</span>{" "}
                            </Link>
                        </li>
                        <li>
                            <Link to='/check' className='flex items-center transition-transform transform hover:translate-x-2'>
                                <AiOutlineUserAdd size={26} className='mr-2 mt-[3rem' />
                                <span className="hidden nav-item-name mt-[3rem">Register</span>{" "}
                            </Link>
                        </li>
                    </ul>

                )
            }

            </div>

           


        </div>
    )
}

export default Navigation