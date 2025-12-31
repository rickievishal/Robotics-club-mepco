const { googleLogin, emailSignup, emailLogin, getAllUsers, updateUserRole, deleteUser } = require("../controllers/authController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = require("express").Router();

router.get('/test',(req,res) => {
    res.send("hello from auth");
})

// Google OAuth
router.get('/google',googleLogin)

// Email/Password Authentication
router.post('/signup', emailSignup);
router.post('/login', emailLogin);

// Admin Routes (Require Authentication + Admin Role)
router.get('/users', authenticateToken, requireRole(['admin']), getAllUsers);
router.put('/users/:userId/role', authenticateToken, requireRole(['admin']), updateUserRole);
router.delete('/users/:userId', authenticateToken, requireRole(['admin']), deleteUser);

module.exports = router;
