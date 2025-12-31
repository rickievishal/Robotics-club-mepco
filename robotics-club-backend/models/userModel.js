const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    name : {type : String},
    email : {type : String, unique: true},
    image : {type : String},
    role : {type : String, default: 'member', enum: ['member', 'officebearer', 'admin']},
    password: {type : String}, // For email/password authentication
    authProvider: {type : String, default: 'email'}, // 'email' or 'google'
    isOnline: {type: Boolean, default: false}, // Track online status
    lastSeen: {type: Date, default: Date.now}, // Track last activity
    chatroomJoined: {type: Boolean, default: false} // Track if user is in chatroom
})

const UserModel = mongoose.model('social-logins',UserSchema);
module.exports = UserModel;
