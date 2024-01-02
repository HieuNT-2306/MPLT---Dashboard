import mongoose from 'mongoose';

const BrandSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    monthlyData: [{
        year:{
            type: Number,
        },
        month: {
            type: Number,
        },
        salesTotal: {
            type: Number,
        },
        salesUnits: {
            type: Number,
        },
        transactionNumbers: {
            type: Number,
        }
    }],
    dailyData: [{
        day: {
            type: Date,
        },
        salesTotal: {
            type: Number,
        },
        salesUnits: {
            type: Number,
        },
        transactionNumbers: {
            type: Number,
        }
    }]
}, {timestamps: true});

const Brand = mongoose.model('Brand', BrandSchema);  
export default Brand;