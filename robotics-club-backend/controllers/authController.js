const { default: axios } = require("axios")
const { oauth2cient } = require("../utils/googleConfig")
const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const googleLogin = async(req,res) => {
    try{
        console.log("the get is received")
        const {code} = req.query
        const googleRes = await oauth2cient.getToken(code)
        oauth2cient.setCredentials(googleRes.tokens)
        
        const userRes = axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )
        const {email ,name ,image} = (await userRes).data
        const role = "member"
        let user = await UserModel.findOne({email});
        if (!user) {
            user = await UserModel.create({
                name,email,image,role
            })
            const {_id} = user;
            const token = jwt.sign({_id,email},
                process.env.JWT_SECRET,
                {
                    expiresIn : process.env.JWT_EXPIRE
                }
            );
            return res.status(200).json({
                message: "Sucess",
                token,
                user
            })
        }
        const { _id } = user;
        const token = jwt.sign(
        { _id, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
        );

        return res.status(200).json({
        message: "Success",
        token,
        user
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

module.exports = {
    googleLogin
}