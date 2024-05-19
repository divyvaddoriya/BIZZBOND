import React from 'react'
import { useEffect, useState } from 'react'
import { FaTrash, FaEdit, FaCheck, FaTimes, FaCentercode } from 'react-icons/fa'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    // useGetUserDetailsQuery,
    useUpdateUserMutation
} from '../../redux/api/usersApiSlice'

import Message from '../../components/Message'
import AdminMenu from './AdminMenu'

const UserList = () => {

    const { data: users, refetch, isLoading, error } = useGetUsersQuery()

    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()

    const [editableUserId, setEditableUserId] = useState(null)
    const [editableUsername, setEditableUsername] = useState('')
    const [editableUserEmail, setEditableUserEmail] = useState('')
    const [editableShopKeeper, setEditableShopKeeper] = useState('')

    const {userInfo} = useSelector(state => state.auth)

    useEffect(() => {
        refetch()
    }, [refetch])

    const deleteHandler = async (id) => {
        if (window.confirm('Are You Sure ?')) {
            try {
                await deleteUser(id)
                refetch()
            } catch (error) {
                toast.error(error.data.message || error.error)
            }
        }
    }

    const toggleEdit = (id, username, email, isShopKeeper) => {
        setEditableUserEmail(email)
        setEditableUserId(id)
        setEditableUsername(username)
        setEditableShopKeeper(isShopKeeper)
    }

    const updateHandler =async (id)=>{
        try {
            updateUser({
                userId: id,
                username: editableUsername,
                email: editableUserEmail,
                isShopKeeper: editableShopKeeper
            })

            setEditableUserId(null)
            refetch()
        } catch (error) {
            toast.error(error.data.message || error.error)
        }
    }
    const setShopKeeperTrue =async (id,Admin)=>{
        try {
            updateUser({
                userId: id,
                username: editableUsername,
                email: editableUserEmail,
                isAdmin: Admin,
                isShopKeeper: true
            })
            setEditableUserId(null)
            refetch()
        } catch (error) {
            toast.error(error.data.message || error.error)
        }
    }
    const setShopKeeperFalse =async (id,Admin)=>{
        try {
            updateUser({
                userId: id,
                username: editableUsername,
                email: editableUserEmail,
                isAdmin: Admin,
                isShopKeeper: false
            })
            setEditableUserId(null)
            refetch()
        } catch (error) {
            toast.error(error.data.message || error.error)
        }
    }

    return <div className='p-4'>
        <h1 className='text-center p-2 text-4xl font-semibold mb-4'>
            USERS
        </h1>
        {isLoading ?
            (<Loader />) :
            error ?
                (<Message variant='danger'>{error?.data.message || error.message}</Message>)
                : (
                    <div className='flex flex-col md:felx-row'>
                        {/* {admin menu} */}
                        <AdminMenu />
                        <table className='w-full border-4 border-blue-400 md:w-4/5 mx-auto '>
                            <thead >
                                <tr className='border-blue-400 border-4' >
                                    <th className='px-4 py-2 text-left'>ID</th>
                                    <th className='px-4 py-2 text-left'>NAME</th>
                                    <th className='px-4  py-2 text-left'>EMAIL</th>
                                    <th className='px-4 py-2 text-left'>ADMIN</th>
                                    <th className='px-4 py-2 text-left'>WHOLESELLER</th>
                                </tr>
                            </thead>
                            <tbody >
                                {users.map(user => user._id !== userInfo._id ? (
                                    <tr key={user._id}>
                                        <td className='px-4 py-2 '>{user._id}</td>
                                        <td className='px-4 py-2 '>
                                            {editableUserId === user._id 
                                                ? (
                                                    <div className="flex items-center">
                                                        <input type="text" value={editableUsername} onChange={e => setEditableUsername(e.target.value)} className='w-full p-2 border rounded-lg' />
                                                        <button className='ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg' onClick={() => updateHandler(user._id)}>
                                                            <FaCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center ">{user.username} {"  "}
                                                        <button onClick={() => toggleEdit(user._id, user.username, user.email, user.isShopKeeper)}>
                                                            <FaEdit className='ml-[1rem]' />
                                                        </button>
                                                    </div>
                                                )}</td>
                                        <td className='px-4 py-2'>
                                            {
                                                editableUserId === user._id ? (
                                                    <div className='flex items-center '>
                                                        <input type="text" value={editableUserEmail} onChange={e => setEditableUserEmail
                                                            (e.target.value)
                                                        } className='w-full p-2 border rounded-lg' />
                                                        <button onClick={() => updateHandler(user._id)} className='ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg'>
                                                            <FaCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center ">
                                                        {user.email} {"  "}
                                                        <button onClick={() => toggleEdit(user._id, user.username, user.email, user.isShopKeeper)}>
                                                            <FaEdit className='ml-[1rem]' />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td className='px-4 py-2'>
                                            {
                                                user.isAdmin ? (
                                                    <FaCheck style={{ color: 'green' }} />
                                                ) : (
                                                    <FaTimes style={{ color: 'red' }} />
                                                )
                                            }
                                        </td>
                                        <td className='px-4 py-2'>
                                            {editableUserId === user._id ? (
                                                <div className='flex'>
                                                    <button  onClick={() => setShopKeeperTrue(user._id,user.isAdmin)} className='ml-2 bg-green-500 text-white py-2 px-4 rounded-lg'>
                                                        <FaCheck style={{ color: 'green' }} />
                                                    </button>
                                                    <button  onClick={() => setShopKeeperFalse(user._id,user.isAdmin)} className='ml-2 bg-red-300 text-white py-2 px-4 rounded-lg'>
                                                        <FaTimes style={{ color: 'red' }} />
                                                    </button>

                                                </div>
                                            ) : (
                                                <button  onClick={() => toggleEdit(user._id, user.username, user.email,user.isShopKeeper) }>
                                                    {user.isShopKeeper ? (
                                                        <FaCheck style={{ color: 'green' }} />
                                                    ) : (
                                                        <FaTimes style={{ color: 'red' }} />
                                                    )}
                                                </button>
                                            )}


                                        </td>
                                        <td className='px-4 py-2'>
                                            {!user.isAdmin && (
                                                <div className="flex">
                                                    <button onClick={() => deleteHandler(user._id)} className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : (<></>))}
                            </tbody>
                        </table>
                    </div>
                )}
    </div>
}

export default UserList