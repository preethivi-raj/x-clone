export const signup = (req , res)=>{
    res.json({
        data: "Hello from signup"
    })
}

export const login = (req , res)=>{
    res.json({
        message :"message from login"
    })
}

export const logout = (req , res)=>{
    res.json({
        message: "message from logout"
    })
}