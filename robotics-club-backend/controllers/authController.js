// Production logging utility
const log = {
    info: (component, message) => console.log(`[INFO] [${component}] ${message}`),
    warn: (component, message) => console.warn(`[WARN] [${component}] ${message}`),
    error: (component, message) => console.error(`[ERROR] [${component}] ${message}`),
    request: (method, path, userId) => console.log(`[REQUEST] [${method}] ${path} - User: ${userId || 'anonymous'}`)
};

const { default: axios } = require("axios")
const { oauth2cient } = require("../utils/googleConfig")
const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { hashPassword, verifyPassword, validatePasswordStrength } = require("../utils/passwordUtils")

const googleLogin = async(req,res) => {
    try{
        log.info('AUTH', 'Google login request received');
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
                name,email,image,role,authProvider: 'google'
            })
            const {_id} = user;
            const token = jwt.sign({_id,email,role},
                process.env.JWT_SECRET,
                {
                    expiresIn : process.env.JWT_EXPIRE
                }
            );
            log.info('AUTH', `New Google user registered: ${email}`);
            return res.status(200).json({
                message: "Success",
                token,
                user
            })
        }
        const { _id } = user;
        const token = jwt.sign(
        { _id, email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
        );

        log.info('AUTH', `Google user logged in: ${email}`);
        return res.status(200).json({
        message: "Success",
        token,
        user
        });
    }catch(err){
        log.error('AUTH', 'Google login failed');
        res.status(500).json({
            message: "internal server error"
        })
    }
}

// Email/Password Signup
const emailSignup = async(req,res) => {
    try{
        const {name, email, password} = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            log.warn('AUTH', `Signup failed - email already exists: ${email}`);
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            log.warn('AUTH', `Signup failed - weak password: ${email}`);
            return res.status(400).json({
                message: "Password is too weak. Please choose a stronger password.",
                passwordStrength: passwordValidation.strengthText
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            image: null,
            role: "member",
            authProvider: 'email'
        });

        const { _id } = user;
        const token = jwt.sign(
            { _id, email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        log.info('AUTH', `New user registered: ${email}`);
        return res.status(200).json({
            message: "Success",
            token,
            user
        });
    }catch(err){
        log.error('AUTH', 'Email signup failed');
        res.status(500).json({
            message: "internal server error"
        });
    }
}

// Email/Password Login
const emailLogin = async(req,res) => {
    try{
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await UserModel.findOne({email});
        if (!user) {
            log.warn('AUTH', `Login failed - user not found: ${email}`);
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Check if user used email authentication
        if (user.authProvider !== 'email') {
            log.warn('AUTH', `Login failed - wrong auth provider: ${email}`);
            return res.status(400).json({
                message: "This account uses Google authentication. Please use Google login."
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            log.warn('AUTH', `Login failed - invalid password: ${email}`);
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const { _id } = user;
        const token = jwt.sign(
            { _id, email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        log.info('AUTH', `User logged in: ${email} (${user.role})`);
        return res.status(200).json({
            message: "Success",
            token,
            user
        });
    }catch(err){
        log.error('AUTH', 'Email login failed');
        res.status(500).json({
            message: "internal server error"
        });
    }
}

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            log.warn('AUTH', `Unauthorized user list request by ${req.user.email}`);
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });
        log.info('AUTH', `Admin ${req.user.email} fetched user list`);
        res.status(200).json({ users });
    } catch (err) {
        log.error('AUTH', 'Failed to fetch users');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            log.warn('AUTH', `Unauthorized role update by ${req.user.email}`);
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { userId } = req.params;
        const { role } = req.body;

        // Validate role
        if (!['member', 'officebearer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        log.info('AUTH', `Admin ${req.user.email} updated role for user ${userId} to ${role}`);
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (err) {
        log.error('AUTH', 'Failed to update user role');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            log.warn('AUTH', `Unauthorized user deletion by ${req.user.email}`);
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { userId } = req.params;

        const user = await UserModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        log.info('AUTH', `Admin ${req.user.email} deleted user ${userId}`);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        log.error('AUTH', 'Failed to delete user');
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    googleLogin,
    emailSignup,
    emailLogin,
    getAllUsers,
    updateUserRole,
    deleteUser
}
