import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
    userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cost: String,
    products:{
        type: [mongoose.Types.ObjectId],
        of: Number
    }
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', TransactionSchema);  // User is the name of the model
export default Transaction;