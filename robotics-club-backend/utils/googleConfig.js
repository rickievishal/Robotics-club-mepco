const {google} =require("googleapis")
const GOOGLE_CLIENT = process.env.GOOGLE_CLIENT;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET

exports.oauth2cient = new google.auth.OAuth2(
    GOOGLE_CLIENT ,
    GOOGLE_SECRET,
    "postmessage"
)