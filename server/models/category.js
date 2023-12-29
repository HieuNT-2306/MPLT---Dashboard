import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
    name: String,
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
        }
    }]
}, {timestamps: true});

const Category = mongoose.model('Category', CategorySchema);  // User is the name of the model
export default Category;