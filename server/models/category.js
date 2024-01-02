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

const Category = mongoose.model('Category', CategorySchema);  // User is the name of the model
export default Category;