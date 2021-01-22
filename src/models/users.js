const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Please insert a valid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

//hide sensitive data
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//auth token generator
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({_id: user._id.toString()},process.env.SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
} 

//password hashing
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//user login
userSchema.statics.findByCredintials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Invalid email or password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid email or password')
    }
    return user
}

const User = mongoose.model('User',userSchema)
module.exports = User