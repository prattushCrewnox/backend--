import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    email: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
}, { timestamb: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        next(error)
    }
})
userSchema.methods.isPasswordCorrect = async function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error("Incorrect Password.")
    }
}
userSchema.methods.generateTokenAuth = async function(){
    const token = jwt.sign(
        {userId : this._id, email : this.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION}
    )
    return token
}

const User = mongoose.model("User", userSchema)

export default User;