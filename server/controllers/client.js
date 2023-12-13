import Product from "../models/product.js";
import ProductStat from "../models/productStat.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const productsStat = await Promise.all(products.map(async (product) => {
            const productStat = await ProductStat.find({ productId: product._id });

            return {
                ...product._doc,
                productStat
            };
        }));

        res.status(200).json(productsStat);
        
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}