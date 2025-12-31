const mongoose = require ("mongoose")
const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
    .then(()=> {
        console.log("✅ DB is connected successfully")
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message)
        console.log("💡 Make sure MongoDB is running: brew services start mongodb/brew/mongodb-community")
        process.exit(1)
    })
