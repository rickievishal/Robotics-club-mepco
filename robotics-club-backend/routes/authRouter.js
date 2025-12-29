const { googleLogin } = require("../controllers/authController");

const router = require("express").Router();

router.get('/test',(req,res) => {
    res.send("hello from auth");
})
router.get('/google',googleLogin)
module.exports = router;