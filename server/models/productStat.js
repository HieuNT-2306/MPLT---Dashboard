import mongoose from 'mongoose';

const ProductStatSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    yearlySalesTotal: {
        type: Number, 
        default: 0
    },
    yearlySalesUnits:{
        type: Number, 
        default: 0
    },
    year:{
        type: Number,
        required: true
    },
    monthlyData: [{
        month: {
            type: Number,
            required: true
        },
        salesTotal: {
            type: Number,
            required: true
        },
        salesUnits: {
            type: Number,
            required: true
        }
    }],
    dailyData: [{
        day: {
            type: String,
        },
        salesTotal: {
            type: Number,
            required: true
        },
        salesUnits: {
            type: Number,
            required: true
        }
    }],
}, {timestamps: true});

const ProductStat = mongoose.model('ProductStat', ProductStatSchema);  // User is the name of the model
export default ProductStat;