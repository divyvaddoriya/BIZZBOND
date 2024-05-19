import  User from '../models/userModel.js'
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from  'bcryptjs'
import createToken from "../utilities/createToken.js"
import express from 'express'

const createUser = asyncHandler(async(req,res,next) => {
    const {username, email,password,isShopKeeper} = req.body;

    if(!username || !email || !password){
        throw new Error('plese fill the input');
    }

    const userExist = await User.findOne({email})
    if(userExist) res.status(400).send("User alreaddy exist")
    
    const salt = await  bcrypt.genSalt(10)  
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({username,email,password: hashedPassword,isShopKeeper})
    
    try{
        await newUser.save()
        createToken(res,newUser._id)
        
        res.status(201).json({_id: newUser._id , username : newUser.username , email: newUser.email, isAdmin: newUser.isAdmin,
           isShopKeeper:  newUser.isShopKeeper
        })
    }
    catch(error){
        res.status(400)
        throw new Error ("Invalid user data")
    }
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password}  = req.body
    
    const existingUser = await User.findOne({email})
    
    if(existingUser){
        const isPasswordValid =  await bcrypt.compare(password,existingUser.password);
        if(isPasswordValid){
            createToken(res,existingUser._id)
            
            res.status(201).json({_id: existingUser._id , username : existingUser.username , email: existingUser.email, isAdmin: existingUser.isAdmin , isShopKeeper: existingUser.isShopKeeper})
            return ;
        }
    }
})

const logOutCurrentUser =  asyncHandler((req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })
    
    res.status(200).json({message: "loggd out succesfully"})
})

const getAllUsers=asyncHandler(async (req,res)=>{
    const users= await User.find({})
    res.json(users)
})

const getCurrentUserProfile=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    }
    else{
        res.status(404)
        throw new Error("user not found")
    }
})

const updateCurrentUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)
    if(user){
    user.username = req.body.username || user.username
    user.email= req.body.email || user.email
    user.isShopKeeper = Boolean(req.body.isShopKeeper) || user.isShopKeeper

    if(req.body.password){
        const salt = await  bcrypt.genSalt(10)  
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        user.password= hashedPassword
    }
    
    const updatedUser = await user.save();
    
    res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isShopKeeper: updatedUser.isShopKeeper
    })
}
else{
    res.status(404)
    throw new Error("user not found")
}

})


const deleteUserById= asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id)

    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error ('cannot delete admin')
        }
        await User.deleteOne({_id: user._id})
        res.json({message : 'user removed'})
    }
    else{
        res.status(404)
        throw new Error ("user not found")
    }

})

const getUserById = asyncHandler(async(req,res)=>{
    const user =await User.findById(req.params.id).select("-password");

    if(user){
        res.json(user)
    }
    else{
        res.status(404)
        throw new Error ("user not found")
    }

})

const updateUserById=asyncHandler(async(req,res)=>{
  
    const user = await User.findById(req.params.id)

    if(user){
        user.username= req.body.username || user.username
        user.email= req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)
        user.isShopKeeper = Boolean(req.body.isShopKeeper)

        const updatedUser =await  user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: Boolean(updatedUser.isAdmin),
            isShopKeeper: Boolean(updatedUser.isShopKeeper)
        })
    }
    else{
        res.status(404)
        throw new Error ("user not found")
    }
     
})

export {createUser,loginUser,logOutCurrentUser,getAllUsers,getCurrentUserProfile,updateCurrentUserProfile,deleteUserById,getUserById,updateUserById} ;