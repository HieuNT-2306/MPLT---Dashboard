import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true,
        email: true
    },
    address: {
        type: String,
    },
    phonenumber: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'customer'],
        default: 'user'
    },
    purchasevalue: {
        type: Number,
        default: 0
    },
    purchaseamount: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);  // User is the name of the model
export default User;