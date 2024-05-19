import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

const authenticate = asyncHandler(async (req,res,next)=>{
    let token;
    //read jwt from 'jwt' cookie 
    token = req.cookies.jwt

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user= await User.findById(decoded.userId).select('-password')
            next()
        }
        catch(error){
            res.status(401)
            throw new Error ("Not authorized , token failed")
        }
    }
    else{
        res.status(401)
        throw new Error ("Not authorized , no token ")
    }
})

//check for the admin 

const authorizedAdmin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }
    else{
        res.status(401).send("not authorizes as an Admin")
    }
}
const authorizedWholeSeller = (req,res,next)=>{
    if(req.user && req.user.isShopKeeper){
        next()
    }
    else{
        res.status(401).send("Only Shop Keeper can Access")
    }
}

export {authenticate , authorizedAdmin,authorizedWholeSeller}