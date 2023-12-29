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

export const postProducts = async (req, res) => {
    try {
        const { name, description, price, category, supply } = req.body;
        const newProduct = new Product({
            name, description, price, category, supply
        });
        await newProduct.save();
        const newProductStat = new ProductStat({
            productId: newProduct._id,
            yearlySalesTotal: 0,
            yearlySalesUnits: 0,
            year: new Date().getFullYear(),
            monthlyData: [],
            dailyData: []
        });
        await newProductStat.save();
        res.status(201).json({ product: newProduct, productStat: newProductStat });
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, supply } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.supply = supply;

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postCustomer = async (req, res) => {
    try {
        const { name, email, phonenumber, address, password, purchasevalue, purchaseamount } = req.body;
        const newUser = new User({
            name, email, phonenumber, password, address, purchasevalue, purchaseamount,
            role: "user",
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch(error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};