import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
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
            default: 0,
        },
        salesUnits: {
            type: Number,
            default: 0,
        },
        transactionNumbers: {
            type: Number,
            default: 0,
        }
    }],
    dailyData: [{
        day: {
            type: Date,
        },
        salesTotal: {
            type: Number,
            default: 0,
        },
        salesUnits: {
            type: Number,
            default: 0,
        },
        transactionNumbers: {
            type: Number,
            default: 0,
        }
    }]
}, {timestamps: true});

const Category = mongoose.model('Category', CategorySchema);  // User is the name of the model
export default Category;