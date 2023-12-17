import Product from "../models/product.js";
import ProductStat from "../models/productStat.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

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

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}

export const getTransactions = async (req, res) => {
    try {
        const {page = 1, pageSize = 10, sort = null, search = ""} = req.query;
        const generateSort = (sort) => {
            if (!sort) return {}; 
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: sortParsed.order === "ascend" ? 1 : -1 
            };
            return sortFormatted;
        }
        console.log(sort)
        const sortFormatted = Boolean(sort) ? generateSort(sort) : {};
        const transactions = await Transaction.find({
            $or: [
                {cost: {$regex: new RegExp(search, "i") }},
            ]
        }).populate({
            path: 'userId',
            select: 'email name phonenumber -_id'
        })
        .sort(sortFormatted).limit(Number(pageSize)).skip((Number(page) - 1) * Number(pageSize));
        
        const total = await Transaction.countDocuments({
            name: {$regex: search, $options: "i"}
        });

        res.status(200).json({
            transactions,
            total
        });
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}
