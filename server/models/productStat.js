import mongoose from 'mongoose';

const ProductStatSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    yearlySalesTotal: {
        type: Number, 
        required: true,
    },
    yearlySalesUnits:{
        type: Number, 
        required: true,
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
}, {timestamps: true});

const ProductStat = mongoose.model('ProductStat', ProductStatSchema);  // User is the name of the model
export default ProductStat;