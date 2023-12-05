import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    address: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin'
    },
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);  // User is the name of the model
export default User;