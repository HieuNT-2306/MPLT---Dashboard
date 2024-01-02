import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number, 
        required: true,
    },
    description: {
        type: String, 
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    supply: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);  // User is the name of the model
export default Product;