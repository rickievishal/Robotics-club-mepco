const mongoose = require("mongoose")
const UserModel = require("./models/userModel")
const { hashPassword } = require("./utils/passwordUtils")
require("dotenv").config()
require("./models/dbConnection")

async function createAdmin() {
    try {
        // Admin user details
        const adminData = {
            name: "System Administrator",
            email: "admin@roboticsclub.com",
            role: "admin",
            authProvider: 'email',
            isOnline: false,
            chatroomJoined: false
        }

        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ email: adminData.email })
        if (existingAdmin) {
            console.log("❌ Admin user already exists with email:", adminData.email)
            console.log("Current admin user:", existingAdmin)
            return existingAdmin
        }

        // Create admin user
        const hashedPassword = await hashPassword("admin123")
        const admin = await UserModel.create({
            ...adminData,
            password: hashedPassword
        })

        console.log("✅ Admin user created successfully!")
        console.log("Admin Details:")
        console.log("- Name:", admin.name)
        console.log("- Email:", admin.email)
        console.log("- Role:", admin.role)
        console.log("- Password: admin123")
        console.log("- ID:", admin._id)

        return admin
    } catch (error) {
        console.error("❌ Error creating admin user:", error)
        throw error
    }
}

async function createAdmin2() {
    try {
        // Alternative admin user details
        const adminData = {
            name: "Club Admin",
            email: "clubadmin@roboticsclub.com",
            role: "admin",
            authProvider: 'email',
            isOnline: false,
            chatroomJoined: false
        }

        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ email: adminData.email })
        if (existingAdmin) {
            console.log("❌ Admin user already exists with email:", adminData.email)
            console.log("Current admin user:", existingAdmin)
            return existingAdmin
        }

        // Create admin user
        const hashedPassword = await hashPassword("admin456")
        const admin = await UserModel.create({
            ...adminData,
            password: hashedPassword
        })

        console.log("✅ Second admin user created successfully!")
        console.log("Admin Details:")
        console.log("- Name:", admin.name)
        console.log("- Email:", admin.email)
        console.log("- Role:", admin.role)
        console.log("- Password: admin456")
        console.log("- ID:", admin._id)

        return admin
    } catch (error) {
        console.error("❌ Error creating admin user:", error)
        throw error
    }
}

async function main() {
    try {
        console.log("🚀 Starting admin user creation...")
        
        await createAdmin()
        await createAdmin2()
        
        console.log("\n🎉 Admin creation completed!")
        console.log("\n📋 Admin Users Created:")
        console.log("1. Email: admin@roboticsclub.com | Password: admin123")
        console.log("2. Email: clubadmin@roboticsclub.com | Password: admin456")
        console.log("\n🔐 Admin Features Available:")
        console.log("- User management at: /club/admin/users")
        console.log("- Role management capabilities")
        console.log("- Full system access")
        
    } catch (error) {
        console.error("❌ Failed to create admin users:", error)
    } finally {
        // Close database connection
        await mongoose.connection.close()
        console.log("🔌 Database connection closed")
    }
}

main()
