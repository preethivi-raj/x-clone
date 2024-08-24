import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

import generateTokenSetCookie from "../lib/generateToken.js"

export const signup = async (req , res)=>{
   try{
    const {fullName , username , email , password} = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
        return res.status(400).json({error:"Invalid Email Format"})
    }

    const existingUser = await User.findOne( { username: username } )
    if(existingUser){
        return res.status(400).json( { error : "This username is already Taken "} )
    }

    const existingEmail = await User.findOne( { email : email } )
    if(existingEmail){
        return res.status(400).json( { error : "Already have this email address" } )
    }

    if(password.length <6){
        res.status(400).json( { error : "Password must be at least 6 characters long" } )
    }

    const salt= await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)


    const newUser  = new User({
        fullName  :  fullName ,
        username :  username ,
        password : hashedPassword ,
        email : email
    })

    if(newUser){
       generateTokenSetCookie(newUser._id, res)
        await newUser.save()

        res.status(201).json({
            _id : newUser._id ,
            fullName  : newUser.fullName ,
            username :  newUser.username ,
            email : newUser.email,
            fallowers : newUser.followers ,
            following : newUser.following,
            profileImg : newUser.profileImg,
            coverImg : newUser.coverImg,

        })
    }
    else{
        res.status(400).json( { error : "Invalid User Data" } )
    }

   }
   catch(error){
      console.log("Error in signup controller",error.message)
      res.status(500).json( { error : "Internal Server Error "} )
   }
}

export const login = async (req , res)=>{
   try{
     const {username , password} = req.body

     const user = await User.findOne({username : username})
     const isPasswordValid = await bcrypt.compare(password , user?.password || "")

     if(!user || !isPasswordValid){
        return res.status(400).json( { error : "Invalid Username or Password"} )
     }

  
     generateTokenSetCookie(user._id , res);

     res.status(201).json({
        _id : user._id ,
        fullName  : user.fullName ,
        username :  user.username ,
        email : user.email,
        fallowers : user.followers ,
        following : user.following,
        profileImg : user.profileImg,
        coverImg : user.coverImg,

    })


   }catch(error){
      console.log("Error in Login controller",error.message)
      res.status(500).json( { error : "Internal Server Error "})
   }
}

export const logout =async (req , res)=>{
   try{
    res.cookie("jwt" ,"" , {maxAge :0})
    res.status(200).json( { message : "Logout Success"})
      
   }catch(error){
    console.log("Error in Logout controller",error.message)
    res.status(500).json( { error : "Internal Server Error "})
   }
}

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};