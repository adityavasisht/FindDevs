const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        trim: true
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: { 
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    minUppercase: 1,
                })
            },
            message: "Your password is not strong, enter a strong password."
        }
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                return ["male", "female", "others"].includes(value);
            },
            message: "gender must be male, female or others"
        }
    },
    photoUrl: {
        type: String,
        trim: true,
        default: "https://www.cornwallbusinessawards.co.uk/2018-judging-panel/dummy450x450/",
        validate: {
            validator: v => validator.isURL(v),
            message: "your url is not valid."
        }
    },
    about: {
        type: String,
        default: "This is the default about of the user!",
    },
    bio: {
        type: String,
    },
    skills: {
        type: [String],
        trim: true
    },

    
    isPremium: {
        type: Boolean,
        default: false,
    },
    membershipType: {
        type: String, 
        default: null, 
    },
    membershipStartDate: {
        type: Date,
        default: null,
    },
    membershipExpiry: {
        type: Date,
        default: null,
    },
    razorpayOrderId: {
        type: String,
        default: null,
    },
    razorpayPaymentId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true
});

const userModel = mongoose.model('userModel', UserSchema);

module.exports = userModel;