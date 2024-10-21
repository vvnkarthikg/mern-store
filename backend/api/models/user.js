const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phone:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set the update date
    },
    profilepic:{
        type:String,
        default:''
    }
});

// Update updatedAt field on every update
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

userSchema.plugin(AutoIncrement, { inc_field : 'userId' });

module.exports = mongoose.model('User', userSchema);