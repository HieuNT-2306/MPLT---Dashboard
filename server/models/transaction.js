import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number, 
        }
    }],
    cost: Number,
    numberOfProducts: Number,
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', TransactionSchema);  // User is the name of the model
export default Transaction;