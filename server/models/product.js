import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    searchName: {
        type: String,
        default: '',
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
    img: {
        type: String,
        required: true,
        default: 'https://www.proclinic-products.com/build/static/default-product.30484205.png'
    },
    dataFromScrapingTiki: {
        type: Object,
    },
    dataFromScrapingSendo: {
        type: Object,
    },
    dataFromScrapingLazada: {
        type: Object,
    },
    dataFromScrapingHasaki: {
        type: Object,
    },
    dataFromScrapingSendo: {
        type: Object,
    },
    priceHistory: [{
        price: {
            type: Number,
        },
        date: {
            type: Date,
        }
    }],
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);  // User is the name of the model
export default Product;